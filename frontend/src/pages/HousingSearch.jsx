import React, { useEffect, useMemo, useState } from "react";
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

// Dorms and Listings are separate tables on the backend (different
// columns entirely), so we fetch both and normalize them into one
// shape the UI can render identically. school comes from a backend
// join (Dorms.school_name / Listings.school_names) rather than being
// looked up client-side. rawRating stays numeric (or null) so the
// rating filter can compare it, separate from the display string.
function normalizeDorm(d) {
  return {
    id: d.dorm_id,
    type: "dorm",
    name: d.name,
    school: d.school_name,
    subtitle: "On-Campus Dorm",
    rawRating: d.avg_rating != null ? Number(d.avg_rating) : null,
  };
}

function normalizeListing(l) {
  const schoolLabel = l.school_names || "No linked school yet";
  return {
    id: l.listing_id,
    type: "listing",
    name: l.name || l.address, // fall back to address if no building name (e.g. a private landlord's single house)
    school: schoolLabel,
    subtitle: `${l.address} · Off-Campus · ${l.bedrooms} bed · $${l.monthly_rent}/mo`,
    rawRating: l.avg_rating != null ? Number(l.avg_rating) : null,
  };
}

function HousingSearch() {
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | dorm | listing
  const [ratingFilter, setRatingFilter] = useState("any"); // any | 4 | 3
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
  }, []);

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

  // Groups the filtered results by campus, alphabetically.
  const grouped = useMemo(() => {
    const map = new Map();
    for (const h of filtered) {
      if (!map.has(h.school)) map.set(h.school, []);
      map.get(h.school).push(h);
    }
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }, [filtered]);

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

  const hasActiveFilters = search || typeFilter !== "all" || ratingFilter !== "any";

  return (
    <main className="page">
      <PageHeader
        title="Search Student Housing"
        subtitle="Browse dorms and off-campus apartments near your school."
        icon="🏠"
      />
      
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by school or housing name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Housing Types</option>
          <option value="dorm">On-Campus Dorm</option>
          <option value="listing">Off-Campus Apartment</option>
        </select>
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="any">Any Rating</option>
          <option value="4">4 stars and up</option>
          <option value="3">3 stars and up</option>
        </select>
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

        function renderCard(h) {
          return (
            <div className="card" key={`${h.type}-${h.id}`}>
              <PhotoPlaceholder size="card" />
              <h3>{h.name}</h3>
              <p>{h.subtitle}</p>
              <StarRating rating={h.rawRating} />
              <div className="button-row">
                <Link to={`/housing/${h.type}/${h.id}`} className="primary-btn">
                  View Reviews
                </Link>
                {h.type === "listing" && isAuthenticated && (
                  <button className="secondary-btn" onClick={() => toggleFavorite(h.id)}>
                    {favoriteIds.has(h.id) ? "Saved" : "Save"}
                  </button>
                )}
              </div>
            </div>
          );
        }

        return (
          <section key={school} className="campus-section" style={{ marginTop: "36px" }}>
            <h2>{school}</h2>

            {dorms.length > 0 && (
              <div className="housing-subsection">
                <h3 className="housing-subsection-label">On-Campus Dorms</h3>
                <div className="card-grid">{dorms.map(renderCard)}</div>
              </div>
            )}

            {listings.length > 0 && (
              <div className="housing-subsection">
                <h3 className="housing-subsection-label">Off-Campus Listings</h3>
                <div className="card-grid">{listings.map(renderCard)}</div>
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}

export default HousingSearch;
