import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import SkeletonCards from "../components/SkeletonCards";

function ActivityHistory() {
  const { isAuthenticated, checkingAuth } = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get("/activity/me?limit=100", { auth: true });
        setActivity(data.activities || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAuthenticated]);

  if (checkingAuth) return <main className="page"><p>Loading...</p></main>;

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="card logged-out-card">
          <h1>Login Required</h1>
          <p>You need to be logged in to view your activity.</p>

          <div className="button-group left-buttons">
            <Link to="/login" className="primary-btn">Log In</Link>
            <Link to="/register" className="secondary-btn">Sign Up</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title="Activity History"
        subtitle="Everything you've saved and reviewed."
        icon="📌"
      />

      {loading && <SkeletonCards count={4} />}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && activity.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📌</div>
          <h3>No activity yet</h3>
          <p>Save a listing or write a review to see it show up here.</p>
        </div>
      )}

      {!loading && !error && activity.length > 0 && (
        <div className="activity-list">
          {activity.map((item) => (
            <div className="activity-item" key={item.id}>
              <div className="activity-icon">{item.icon || "📌"}</div>
              <p>{item.text}</p>
              <span>
                {item.time ? new Date(item.time).toLocaleDateString() : "Recently"}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ActivityHistory;