import { useEffect, useState } from "react";
import { roommateMatchesApi } from "../api/roommateMatches";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ScoreBadge from "../components/ScoreBadge";
import SkeletonCards from "../components/SkeletonCards";
import PageHeader from "../components/PageHeader";

const CURRENT_SEMESTER = "Fall";
const CURRENT_YEAR = new Date().getFullYear();

function RoommateMatches() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
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
      showToast(status === "accepted" ? "Match accepted!" : "Match declined.", "info");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setRespondingId(null);
    }
  }

  async function handleAnalysis(matchId) {
      setAnalyzingId(matchId);

      try {
          const data = await roommateMatchesApi.getAnalysis(matchId);
          setAnalysisByMatch((prev)=> ({
              ...prev,
              [matchId]: data,
          }));
      } catch (err) {
          console.error("AI analysis failed:", err);
          showToast("AI analysis is temporarily unavailable. Please try again later.", "error");
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
      <PageHeader
        title="Roommate Matches"
        subtitle="Matches are computed from your roommate profile — sleep schedule, cleanliness, noise tolerance, study habits, and budget overlap."
        icon="🤝"
      />

      {loading && <SkeletonCards count={3} />}
      {error && (
        <p style={{ color: "crimson" }}>
          {error}
          {error.includes("Create a roommate profile") && (
            <> — <a href="/roommate-profile">create one here</a>.</>
          )}
        </p>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <h3>No matches yet</h3>
          <p>No other students have roommate profiles yet this semester — check back soon.</p>
        </div>
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
            <div>
              <ScoreBadge score={match.compatibility_score} />
            </div>
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
                    <div>
                        <ScoreBadge score={analysisByMatch[match.match_id].adjustedScore} />
                    </div>
                    <p>
                        <strong>AI Adjustment: </strong>{" "}
                        {analysisByMatch[match.match_id].adjustment > 0 ? "+" :""}
                        {analysisByMatch[match.match_id].adjustment} points
                    </p>
                    <p>{analysisByMatch[match.match_id].explanation}</p>

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
