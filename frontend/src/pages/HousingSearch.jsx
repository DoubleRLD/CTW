import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { dormsApi } from "../api/dorms";
import { listingsApi } from "../api/listings";
import { favoritesApi } from "../api/favorites";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/StarRating";
import SkeletonCards from "../components/SkeletonCards";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import PageHeader from "../components/PageHeader";
import { getDormImage, getListingImage } from "../assets/housingImages";

function normalizeAmenities(value, fallback) {
  if (Array.isArray(value) && value.length > 0) return value;

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim());
  }

  return fallback;
}

// Dorms and Listings are separate tables on the backend (different
// columns entirely), so we fetch both and normalize them into one
// shape the UI can render identically. school comes from a backend
// join (Dorms.school_name / Listings.school_names) rather than being
// looked up client-side. rawRating stays numeric (or null) so the
// rating filter can compare it, separate from the display string.
function normalizeDorm(d) {
  const rawRating = d.avg_rating == null ? null : Number(d.avg_rating);

  return {
    id: d.dorm_id,
    type: "dorm",
    name: d.name,
    school: d.school_name || "School unavailable",
    subtitle: `On-Campus - ${d.school_name || "School unavailable"}`,
    rating: rawRating ?? "N/A",
    rawRating,
    reviewCount: d.review_count ?? d.reviews_count ?? 0,
    price: d.semester_cost ?? d.price ?? null,
    priceLabel: "/Semester",
    distance: d.distance || `Near ${d.school_name || "campus"}`,
    image: d.image_url || d.photo_url || d.image || getDormImage(d.name),
    amenities: normalizeAmenities(d.amenities, [
      "Wifi",
      "Laundry",
      "Study Lounge",
      "Gym",
      "Parking",
    ]),
  };
}

function normalizeListing(l) {
  const schoolLabel = l.school_names || "No linked school yet";
  const rawRating = l.avg_rating == null ? null : Number(l.avg_rating);

  return {
    id: l.listing_id,
    type: "listing",
    name: l.name || l.address,
    school: schoolLabel,
    subtitle: `Off-Campus - ${schoolLabel}`,
    rating: rawRating ?? "N/A",
    rawRating,
    reviewCount: l.review_count ?? l.reviews_count ?? 0,
    price: l.monthly_rent ?? l.price ?? null,
    priceLabel: "/Month",
    bedrooms: l.bedrooms ?? null,
    bathrooms: l.bathrooms ?? null,
    distance: l.distance || "Distance unavailable",
    image: l.image_url || l.photo_url || l.image || getListingImage(l.address, l.bedrooms),
    amenities: normalizeAmenities(l.amenities, [
      "Wifi",
      "Laundry",
      "Gym",
      "Parking",
      "Pet Friendly",
    ]),
  };
}

function formatPrice(price) {
  if (!price) return "Price unavailable";
  return `$${Number(price).toLocaleString()}`;
}

function HousingSearch() {
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | dorm | listing
  const [ratingFilter, setRatingFilter] = useState("any"); // any | 4 | 3
  const [distanceFilter, setDistanceFilter] = useState("none");
  const [sortFilter, setSortFilter] = useState("none");
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [dorms, listings] = await Promise.all([
          dormsApi.list(),
          listingsApi.list().catch(() => []),
        ]);
        setHousing([
          ...dorms.map(normalizeDorm),
          ...listings.map(normalizeListing),
        ]);
        if (isAuthenticated) {
          try {
            const favs = await favoritesApi.list();
            setFavoriteIds(new Set(favs));
          } catch (e) {
            // ignore favorites load errors for now
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated]);

  const query = search.toLowerCase();
  const filtered = housing.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(query) || h.school.toLowerCase().includes(query);
    const matchesType = typeFilter === "all" || h.type === typeFilter;
    const matchesRating =
      ratingFilter === "any" ||
      (h.rawRating != null && h.rawRating >= Number(ratingFilter));
    return matchesSearch && matchesType && matchesRating;
  });

  const sortedFiltered = useMemo(() => {
    const sorted = [...filtered];
  
    if (sortFilter === "rating") {
      sorted.sort((a, b) => (b.rawRating ?? 0) - (a.rawRating ?? 0));
    }
  
    if (sortFilter === "price-low") {
      sorted.sort((a, b) => {
        const priceA = a.price == null ? Infinity : Number(a.price);
        const priceB = b.price == null ? Infinity : Number(b.price);
        return priceA - priceB;
      });
    }
  
    if (sortFilter === "price-high") {
      sorted.sort((a, b) => {
        const priceA = a.price == null ? -Infinity : Number(a.price);
        const priceB = b.price == null ? -Infinity : Number(b.price);
        return priceB - priceA;
      });
    }
  
    return sorted;
  }, [filtered, sortFilter]);

  // Groups the sorted, filtered results by campus, alphabetically.
  const grouped = useMemo(() => {
    const map = new Map();
    for (const h of sortedFiltered) {
      if (!map.has(h.school)) map.set(h.school, []);
      map.get(h.school).push(h);
    }
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }, [sortedFiltered]);

  async function toggleFavorite(listingId) {
    if (favoriteIds.has(listingId)) {
      try {
        await favoritesApi.remove(listingId);
        setFavoriteIds((s) => {
          const n = new Set(s);
          n.delete(listingId);
          return n;
        });
        showToast("Removed from saved listings.", "info");
      } catch (err) {
        showToast(err.message, "error");
      }
    } else {
      try {
        await favoritesApi.add(listingId);
        setFavoriteIds((s) => new Set(s).add(listingId));
        showToast("Saved to your favorites.", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  }

  const hasActiveFilters = search || typeFilter !== "all" || ratingFilter !== "any" || distanceFilter !== "none" || sortFilter !== "none";

  function renderCard(h) {
    return (
      <div className="housing-search-card" key={`${h.type}-${h.id}`}>
        {h.image ? (
          <img className="housing-search-image" src={h.image} alt={h.name} />
        ) : (
          <div className="housing-search-image housing-image-placeholder">
            <PhotoPlaceholder size="card" />
          </div>
        )}

        <div className="housing-search-info">
          <h2>{h.name}</h2>

          <p className="blue-text">{h.subtitle}</p>

          {h.type === "listing" && h.bedrooms != null && (
            <p className="listing-bed-bath">
              🛏️ {h.bedrooms} bed{Number(h.bedrooms) === 1 ? "" : "s"}
              {h.bathrooms != null && ` · 🛁 ${h.bathrooms} bath${Number(h.bathrooms) === 1 ? "" : "s"}`}
            </p>
          )}

          <div className="rating-line housing-rating-line">
            <StarRating rating={h.rawRating} />
            <span>({h.reviewCount} reviews)</span>
          </div>

          <div className="amenity-row">
            {h.amenities.slice(0, 4).map((amenity) => (
              <span key={amenity}>• {amenity}</span>
            ))}
          </div>

          <p className="muted-text">📍 {h.distance}</p>
        </div>

        <div className="housing-search-price">
          {h.type === "dorm" ? (
            <p className="muted-text dorm-cost-note">Included in tuition</p>
          ) : (
            <>
              <h2>{formatPrice(h.price)}</h2>
              <p>{h.priceLabel}</p>
            </>
          )}

          <div className="housing-card-actions">
            <Link to={`/housing/${h.type}/${h.id}`} className="primary-btn">
              View Reviews
            </Link>

            {h.type === "listing" && isAuthenticated && (
              <button
                className="secondary-btn"
                onClick={() => toggleFavorite(h.id)}
              >
                {favoriteIds.has(h.id) ? "Saved" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title="Search Student Housing"
        subtitle="Browse dorms and off-campus apartments near your school."
        icon="🏠"
      />
      
      <div className="housing-search-bar">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search by school or housing name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="housing-filter-row">
        <label className="housing-filter-field">
          <span>Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="dorm">On-Campus Dorm</option>
            <option value="listing">Off-Campus Apartment</option>
          </select>
        </label>

        <label className="housing-filter-field">
          <span>Rating</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="any">Any</option>
            <option value="4">4 stars and up</option>
            <option value="3">3 stars and up</option>
          </select>
        </label>

        <label className="housing-filter-field">
          <span>Distance</span>
          <select
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(e.target.value)}
          >
            <option value="none">None</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
          </select>
        </label>

        <label className="housing-filter-field sort-filter">
          <span>Sort</span>
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option value="none">None</option>
            <option value="rating">Rating</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
          </select>
        </label>
      </div>


      {loading && <SkeletonCards count={6} />}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && grouped.size === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h3>No housing found</h3>
          <p>
            {hasActiveFilters
              ? "Try clearing your search or filters to see more results."
              : "Check back soon — housing hasn't been added for your area yet."}
          </p>
        </div>
      )}

      {!loading && !error && [...grouped.entries()].map(([school, items]) => {
        // Within a campus, keep on-campus dorms and off-campus
        // listings visually separate — they're fundamentally
        // different housing types even though they share a school.
        const dorms = items.filter((h) => h.type === "dorm");
        const listings = items.filter((h) => h.type === "listing");

        return (
          <section key={school} className="campus-section" style={{ marginTop: "36px" }}>
            <h2>{school}</h2>

            {dorms.length > 0 && (
              <div className="housing-subsection">
                <h3 className="housing-subsection-label">On-Campus Dorms</h3>
                <div className="housing-results">{dorms.map(renderCard)}</div>
              </div>
            )}

            {listings.length > 0 && (
              <div className="housing-subsection">
                <h3 className="housing-subsection-label">Off-Campus Listings</h3>
                <div className="housing-results">{listings.map(renderCard)}</div>
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}

export default HousingSearch;
