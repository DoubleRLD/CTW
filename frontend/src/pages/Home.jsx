import logo from "../assets/dormscout-logo.png";

function Home() {
        return (
                <main className="page">
                        <section className="hero">
                                <img src={logo} alt="DormScout logo" className="hero-logo" />
                
                                <h1>Find Housing and Roommates with DormScout</h1>

                                <p>
                                        DormScout helps Georgia students compare on-campus dorms, explore
                                        off-campus housing, read student reviews, and find compatible
                                        roommates based on lifestyle, budget, school, and housing preferences.
                                </p>

                                <p className="small-text">Created by Team DoubleRLD</p>

                                <div className="button-group">
                                        <a href="/housing" className="primary-btn">Search Housing</a>
                                        <a href="/roommate-profile" className="secondary-btn">Find Roommates</a>
                                </div>

                                <section className="feature-grid">
                                        <div className="feature-card">
                                                <h3>Compare Housing</h3>
                                                <p>Browse dorms and off-campus apartments near Georgia colleges.</p>
                                        </div>

                                        <div className="feature-card">
                                                <h3>Read Reviews</h3>
                                                <p>Use student reviews to learn about housing quality and experience.</p>
                                        </div>

                                        <div className="feature-card">
                                                <h3>Find Roommates</h3>
                                                <p>Create a profile and find compatible roommates based on your lifestyle.</p>
                                        </div>
                                </section>
                        </section>
                </main>
        );
}
  
export default Home;