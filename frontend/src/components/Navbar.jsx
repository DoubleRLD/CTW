import { Link } from "react-router-dom";
import logo from "../assets/dormscout-logo.png";

function Navbar() {
    return (
      <nav className="navbar">
        <div className="nav-brand">
          <img src={logo} alt="DormScout logo" className="nav-logo" /> 
          <h2>DormScout</h2>
        </div>

        <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/housing">Housing</Link>
            <Link to="/housing">Reviews</Link>
            <Link to="/roommate-profile">Roommate Profile</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
        </div>
      </nav>
    );
}

export default Navbar;