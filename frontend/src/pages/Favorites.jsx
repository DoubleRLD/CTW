import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { favoritesApi } from "../api/favorites";
import { listingsApi } from "../api/listings";
import { useAuth } from "../context/AuthContext";

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
        // fetch details for each saved listing
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
      <h1>Saved Listings</h1>
      {loading && <p>Loading saved listings...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && listings.length === 0 && <p>No saved listings yet.</p>}

      <div className="card-grid">
        {listings.map((l) => (
          <div className="card" key={l.listing_id}>
            <h2>{l.address}</h2>
            <p>{l.school_names || 'No linked school yet'} · {l.bedrooms} bed · ${l.monthly_rent}/mo</p>
            <Link to={`/housing/listing/${l.listing_id}`} className="primary-btn">View</Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Favorites;
