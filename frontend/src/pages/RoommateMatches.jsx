import { useEffect, useState } from "react";
import { roommateMatchesApi } from "../api/roommateMatches";
import { useAuth } from "../context/AuthContext";

const CURRENT_SEMESTER = "Fall";
const CURRENT_YEAR = new Date().getFullYear();

function RoommateMatches() {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingId, setRespondingId] = useState(null);
  const [analysisByMatch, setAnalysisByMatch] = useState({});
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await roommateMatchesApi.getMine(CURRENT_SEMESTER, CURRENT_YEAR);
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond(matchId, status) {
    setRespondingId(matchId);
    try {
      const updated = await roommateMatchesApi.respond(matchId, status);
      setMatches((prev) => prev.map((m) => (m.match_id === matchId ? { ...m, status: updated.status } : m)));
    } catch (err) {
      setError(err.message);
    } finally {
      setRespondingId(null);
    }
  }

  async function handleAnalysis(matchId) {
      setAnalyzingId(matchId);
      setError(null);

      try {
          const data = await roommateMatchesApi.getAnalysis(matchId);
          setAnalysisByMatch((prev)=> ({
              ...prev,
              [matchId]: data.explanation,
          }));
      } catch (err) {
          console.error("AI analysis failed:", err);
          setError("AI analysis is temporarily unavailable. Please try again later.");
      } finally {
          setAnalyzingId(null);
      }
  }
  if (!isAuthenticated) {
    return (
      <main className="page">
            <div className="card logged-out-card">
                <h1>Login Required</h1>
                <p>You need to be logged in to view roommate matches.</p>

                <div className="button-group left-buttons">
                    <a href="/login" className="primary-btn">Log In</a>
                    <a href="/register" className="secondary-btn">Sign Up</a>
                </div>
            </div>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Roommate Matches</h1>
      <p>
        Matches are computed from your roommate profile — sleep schedule,
        cleanliness, noise tolerance, study habits, and budget overlap.
      </p>

      {loading && <p>Finding matches...</p>}
      {error && (
        <p style={{ color: "crimson" }}>
          {error}
          {error.includes("Create a roommate profile") && (
            <> — <a href="/roommate-profile">create one here</a>.</>
          )}
        </p>
      )}

      {!loading && !error && matches.length === 0 && (
        <p>No other students have roommate profiles yet this semester — check back soon.</p>
      )}

      <div className="card-grid">
        {matches.map((match) => (
          <div className="card" key={match.match_id}>
            <h2>{match.other_user_name}</h2>
              {match.other_profile_picture && (
                  <img
                      src={match.other_profile_picture}
                      alt={`${match.other_user_name}'s profile`}
                      style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginBottom: '12px',
                      }}
                      />
              )}
            <p><strong>Sleep Schedule:</strong> {match.other_sleep_schedule}</p>
            <p><strong>Cleanliness:</strong> {match.other_cleanliness_level}/5</p>
            <p><strong>Noise Tolerance:</strong> {match.other_noise_tolerance}/5</p>
            <p>
              <strong>Budget:</strong>{" "}
              {match.other_budget_min && match.other_budget_max
                ? `$${match.other_budget_min} - $${match.other_budget_max}`
                : "Not specified"}
            </p>
            <p>{match.other_bio}</p>
            <p><strong>Compatibility:</strong> {match.compatibility_score}%</p>
            <p><strong>Status:</strong> {match.status}</p>

            <button
                className="secondary-btn"
                disabled={analyzingId === match.match_id}
                onClick={() => handleAnalysis(match.match_id)}
             >
                {analyzingId === match.match_id ? "Analyzing..." : "View AI Analysis"}
            </button>
            {analysisByMatch[match.match_id] && (
                <div>
                    <h3>AI Compatibility Analysis</h3>
                    <p>{analysisByMatch[match.match_id]}</p>
                </div>
              )}

            {match.status === "pending" && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={respondingId === match.match_id}
                  onClick={() => handleRespond(match.match_id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="secondary-btn"
                  disabled={respondingId === match.match_id}
                  onClick={() => handleRespond(match.match_id, "rejected")}
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default RoommateMatches;
