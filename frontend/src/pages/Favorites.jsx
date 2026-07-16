import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { favoritesApi } from "../api/favorites";
import { listingsApi } from "../api/listings";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import PhotoPlaceholder from "../components/PhotoPlaceholder";
import StarRating from "../components/StarRating";
import SkeletonCards from "../components/SkeletonCards";

function Favorites() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function load() {
      try {
        setLoading(true);
        const favIds = await favoritesApi.list();
        const details = await Promise.all(
          favIds.map((id) => listingsApi.get(id).catch(() => null))
        );
        setListings(details.filter(Boolean));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <main className="page">
      <div className="card logged-out-card">
        <h1>Login Required</h1>
        <p>You need to be logged in to view your saved listings.</p>
      </div>
    </main>
  );

  return (
    <main className="page">
      <PageHeader
        title="Saved Listings"
        subtitle="Listings you've bookmarked while browsing housing."
        icon="🔖"
      />

      {loading && <SkeletonCards count={3} />}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h3>No saved listings yet</h3>
          <p>Browse housing and tap "Save" on any off-campus listing to bookmark it here.</p>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="card-grid">
          {listings.map((l) => (
            <div className="card" key={l.listing_id}>
              <PhotoPlaceholder size="card" />
              <h3>{l.name || l.address}</h3>
              {l.name && <p className="small-text">{l.address}</p>}
              <p>{l.school_names || 'No linked school yet'} · {l.bedrooms} bed · ${l.monthly_rent}/mo</p>
              <StarRating rating={l.avg_rating != null ? Number(l.avg_rating) : null} />
              <Link to={`/housing/listing/${l.listing_id}`} className="primary-btn" style={{ marginTop: 12, display: "inline-block" }}>
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;
