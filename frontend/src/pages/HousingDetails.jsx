import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { isAuthenticated, user, checkingAuth } = useAuth();

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
      <h1>Welcome back, {user?.name}</h1>

      <p>
        Manage your housing search, reviews, roommate profile, and roommate
        matches from one place.
      </p>

      <div className="card-grid">
        <div className="card">
          <span className="card-icon">🏠</span>
          <h2>Housing Search</h2>
          <p>Search for dorms and off-campus apartments near your school.</p>
          <Link to="/housing" className="primary-btn">Search Housing</Link>
        </div>

        <div className="card">
          <span className="card-icon">🔖</span>
          <h2>Saved Listings</h2>
          <p>View listings you've bookmarked while browsing.</p>
          <Link to="/favorites" className="primary-btn">View Saved</Link>
        </div>

        <div className="card">
          <span className="card-icon">📝</span>
          <h2>Roommate Profile</h2>
          <p>Update your lifestyle preferences and roommate questionnaire.</p>
          <Link to="/roommate-profile" className="primary-btn">Update Profile</Link>
        </div>

        <div className="card">
          <span className="card-icon">🤝</span>
          <h2>Roommate Matches</h2>
          <p>View compatible roommate matches.</p>
          <Link to="/matches" className="primary-btn">View Matches</Link>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
