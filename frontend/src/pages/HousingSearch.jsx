import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dormsApi } from "../api/dorms";
import { listingsApi } from "../api/listings";
import { favoritesApi } from "../api/favorites";
import { useAuth } from "../context/AuthContext";

// Dorms and Listings are separate tables on the backend (different
// columns entirely), so we fetch both and normalize them into one
// shape the UI can render identically. school comes from a backend
// join (Dorms.school_name / Listings.school_names) rather than being
// looked up client-side.
function normalizeDorm(d) {
  return {
    id: d.dorm_id,
    type: "dorm",
    name: d.name,
    school: d.school_name,
    subtitle: `${d.school_name} · On-Campus Dorm`,
    rating: d.avg_rating ?? "No ratings yet",
  };
}

function normalizeListing(l) {
  // A listing can be linked to more than one nearby school —
  // school_names is already a comma-separated string from the backend.
  const schoolLabel = l.school_names || "No linked school yet";
  return {
    id: l.listing_id,
    type: "listing",
    name: l.address,
    school: schoolLabel,
    subtitle: `${schoolLabel} · Off-Campus · ${l.bedrooms} bed · $${l.monthly_rent}/mo`,
    rating: l.avg_rating ?? "No ratings yet",
  };
}

function HousingSearch() {
  const [housing, setHousing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  // Auth is used to decide whether to show the Save button
  const { isAuthenticated } = useAuth();
  // Track favorites as a Set of listing IDs for quick lookup
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
        // Load the user's saved listing IDs when authenticated so the UI
        // can render the correct Save/Saved state on listing cards.
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

  // Now genuinely matches on school name too, not just the housing
  // name — the placeholder text always claimed this but there was no
  // school data to search against until now.
  const query = search.toLowerCase();
  const filtered = housing.filter(
    (h) =>
      h.name.toLowerCase().includes(query) ||
      h.school.toLowerCase().includes(query)
  );

  return (
    <main className="page">
      <h1>Search Student Housing</h1>
      <p>Browse dorms and off-campus apartments near your school.</p>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by school or housing name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select>
          <option>All Housing Types</option>
          <option>On-Campus Dorm</option>
          <option>Off-Campus Apartment</option>
        </select>
        <select>
          <option>Any Rating</option>
          <option>4 stars and up</option>
          <option>3 stars and up</option>
        </select>
      </div>

      {loading && <p>Loading housing options...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="card-grid">
          {filtered.map((h) => (
            <div className="card" key={`${h.type}-${h.id}`}>
              <h2>{h.name}</h2>
              <p>{h.subtitle}</p>
              <p><strong>Rating:</strong> {h.rating}</p>
              <div className="button-row">
                <Link to={`/housing/${h.type}/${h.id}`} className="primary-btn">
                  View Reviews
                </Link>
                {h.type === 'listing' && isAuthenticated && (
                  // Toggle save/remove. UI optimistically updates local Set
                  // after a successful API response.
                  <button
                    className="secondary-btn"
                    onClick={async () => {
                      const listingId = h.id;
                      if (favoriteIds.has(listingId)) {
                        try {
                          await favoritesApi.remove(listingId);
                          setFavoriteIds((s) => {
                            const n = new Set(s);
                            n.delete(listingId);
                            return n;
                          });
                        } catch (err) {
                          alert(err.message);
                        }
                      } else {
                        try {
                          await favoritesApi.add(listingId);
                          setFavoriteIds((s) => new Set(s).add(listingId));
                        } catch (err) {
                          alert(err.message);
                        }
                      }
                    }}
                  >
                    {favoriteIds.has(h.id) ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p>No housing found.</p>}
        </div>
      )}
    </main>
  );
}

export default HousingSearch;
