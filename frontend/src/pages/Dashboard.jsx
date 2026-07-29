import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import PageHeader from "../components/PageHeader";
import { getListingImage } from "../assets/housingImages";

function Dashboard() {
  const { isAuthenticated, user, checkingAuth } = useAuth();

  const [recentActivity, setRecentActivity] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadDashboardData() {
      setDashboardLoading(true);
      setDashboardError("");

      try {
        const [activityResult, favoriteIdsResult] = await Promise.allSettled([
          api.get("/activity/me", { auth: true }),
          api.get("/favorites", { auth: true }),
        ]);

        if (activityResult.status === "fulfilled") {
          setRecentActivity(activityResult.value.activities || []);
        }

        if (favoriteIdsResult.status === "fulfilled") {
          const ids = favoriteIdsResult.value || [];
          const details = await Promise.all(
            ids.slice(0, 3).map((id) => api.get(`/listings/${id}`).catch(() => null))
          );
          setSavedListings(details.filter(Boolean));
        }

        if (
          activityResult.status === "rejected" ||
          favoriteIdsResult.status === "rejected"
        ) {
          setDashboardError(
            "Dashboard data will load once the backend endpoints are connected."
          );
        }
      } catch {
        setDashboardError(
          "Dashboard data will load once the backend is connected."
        );
      } finally {
        setDashboardLoading(false);
      }
    }

    loadDashboardData();
  }, [isAuthenticated]);

  if (checkingAuth) return <main className="page"><p>Loading...</p></main>;

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="card logged-out-card">
          <h1>Login Required</h1>
          <p>You need to be logged in to view your dashboard.</p>

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
        title={`Welcome back, ${user?.name || user?.email?.split("@")[0] || "Student"}! 👋`}
        subtitle="Here's what's happening with your housing journey."
      />

      <section className="dashboard-actions">
        <div className="dashboard-action-card">
          <div className="dashboard-icon blue-icon">🏠</div>

          <div className="dashboard-card-content">
            <h2>Housing Search</h2>
            <p>
              Find and compare the best on-campus and off-campus housing options
              in Georgia.
            </p>

            <Link to="/housing" className="dashboard-blue-btn">
              Browse Housing
            </Link>
          </div>
        </div>

        <div className="dashboard-action-card">
          <div className="dashboard-icon green-icon">👤</div>

          <div className="dashboard-card-content">
            <h2>Roommate Profile</h2>
            <p>
              Update your preferences and lifestyle to get better roommate
              matches.
            </p>

            <Link to="/roommate-profile" className="dashboard-green-btn">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="dashboard-action-card">
          <div className="dashboard-icon purple-icon">👥</div>

          <div className="dashboard-card-content">
            <h2>Roommate Matches</h2>
            <p>
              View your matches, requests, and start conversations with
              potential roommates.
            </p>

            <Link to="/matches" className="dashboard-purple-btn">
              View Matches
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <h2>Recent Activity</h2>

          <div className="activity-list">
            {dashboardLoading ? (
              <p className="empty-dashboard-message">Loading activity...</p>
            ) : recentActivity.length === 0 ? (
              <p className="empty-dashboard-message">
                No recent activity yet.
              </p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  className="activity-item"
                  key={activity.id || activity.activity_id}
                >
                  <div className="activity-icon">{activity.icon || "📌"}</div>

                  <p>
                    {activity.text ||
                      activity.description ||
                      activity.message ||
                      "Recent dashboard activity"}
                  </p>

                  <span>
                    {activity.time ||
                      activity.created_at ||
                      activity.createdAt ||
                      "Recently"}
                  </span>
                </div>
              ))
            )}
          </div>

          <Link to="/activity" className="view-all-link">
            View all activity →
          </Link>
        </div>

        <div className="dashboard-panel">
          <h2>Saved Listings</h2>

          <div className="saved-listings-list">
            {dashboardLoading ? (
              <p className="empty-dashboard-message">
                Loading saved listings...
              </p>
            ) : savedListings.length === 0 ? (
              <p className="empty-dashboard-message">
                No saved listings yet.
              </p>
            ) : (
              savedListings.map((listing) => (
                <div
                  className="saved-listing-card"
                  key={
                    listing.favorite_id ||
                    listing.id ||
                    listing.listing_id ||
                    listing.dorm_id
                  }
                >
                  {listing.image_url || listing.image || getListingImage(listing.address, listing.bedrooms) ? (
                    <img
                      className="saved-listing-photo"
                      src={
                        listing.image_url ||
                        listing.image ||
                        getListingImage(listing.address, listing.bedrooms)
                      }
                      alt={listing.name || listing.address || "Saved listing"}
                    />
                  ) : (
                    <div className="saved-listing-photo saved-placeholder">
                      🏠
                    </div>
                  )}

                  <div className="saved-listing-info">
                    <h3>{listing.name || listing.address || "Saved Listing"}</h3>
                    <p>{listing.address || "Address unavailable"}</p>
                    <p>{listing.school_names || "No linked school yet"}</p>
                    <p>{listing.bedrooms} bed · ${listing.monthly_rent}/mo</p>
                  </div>

                  <div className="heart-icon">❤️</div>
                </div>
              ))
            )}
          </div>

          <Link to="/favorites" className="view-all-link">
            View all saved listings →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;