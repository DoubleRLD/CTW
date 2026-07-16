import { Link } from "react-router-dom";
import logo from "../assets/dormscout-logo.png";

function Home() {
  return (
    <main className="page">
      <section className="home-hero">
        <img src={logo} alt="DormScout logo" className="home-hero-logo" />

        <h1>Find Housing and Roommates with DormScout</h1>

        <p>
          DormScout helps Georgia students compare on-campus dorms, explore
          off-campus housing, read student reviews, and find compatible
          roommates based on lifestyle, budget, school, and housing preferences.
        </p>

        <p className="small-text home-hero-credit">Created by Team DoubleRLD</p>

        <div className="button-group">
          <Link to="/housing" className="primary-btn">Search Housing</Link>
          <Link to="/roommate-profile" className="secondary-btn">Find Roommates</Link>
        </div>
      </section>

      <section className="feature-grid home-feature-grid">
        <div className="feature-card">
          <span className="card-icon">🏘️</span>
          <h3>Compare Housing</h3>
          <p>Browse dorms and off-campus apartments near Georgia colleges.</p>
        </div>

        <div className="feature-card">
          <span className="card-icon">⭐</span>
          <h3>Read Reviews</h3>
          <p>Use student reviews to learn about housing quality and experience.</p>
        </div>

        <div className="feature-card">
          <span className="card-icon">🤝</span>
          <h3>Find Roommates</h3>
          <p>Create a profile and find compatible roommates based on your lifestyle.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
