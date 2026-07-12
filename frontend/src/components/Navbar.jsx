import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/dormscout-logo.png";

function navLinkClass({ isActive }) {
  return isActive ? "active-link" : undefined;
}

function Navbar() {
  const { isAuthenticated, user, logout, checkingAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="DormScout logo" className="nav-logo" />
        <h2>DormScout</h2>
      </div>

      <div className="nav-links">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/housing" className={navLinkClass}>Housing</NavLink>
        <NavLink to="/roommate-profile" className={navLinkClass}>Roommate Profile</NavLink>
        <NavLink to="/matches" className={navLinkClass}>Matches</NavLink>
        <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>

        {checkingAuth ? null : isAuthenticated ? (
          <>
            <span>Hi, {user?.name}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              Logout
            </a>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            <NavLink to="/register" className={navLinkClass}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
