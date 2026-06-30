function Dashboard() {
    return (
        <main className="page">
            <h1>Student Dashboard</h1>

            <p>
                Manage your housing search, reviews, roommate profile, and roommate
                matches from one place.
            </p>

            <div className="card-grid">
                <div className="card">
                    <h2>Housing Search</h2>
                    <p>Search for dorms and off-campus apartments near your school.</p>
                    <a href="/housing" className="primary-btn">Search Housing</a>
                </div>

                <div className="card">
                    <h2>Roommate Profile</h2>
                    <p>Update your lifestyle preferences and roommate questionnaire.</p>
                    <a href="/roommate-profile" className="primary-btn">Update Profile</a>
                </div>

                <div className="card">
                    <h2>Roommate Matches</h2>
                    <p>View compatible roommate matches.</p>
                    <a href="/matches" className="primary-btn">View Matches</a>
                </div>
            </div>
        </main>
    );
}
  
export default Dashboard;