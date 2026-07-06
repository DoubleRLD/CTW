import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout, checkingAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <h2>DormScout</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/housing">Housing</Link>
        <Link to="/roommate-profile">Roommate Profile</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/dashboard">Dashboard</Link>

        {/* Avoid flashing "Login" for a split second while /auth/me
            is still resolving on page refresh. */}
        {checkingAuth ? null : isAuthenticated ? (
          <>
            <span>Hi, {user?.name}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
