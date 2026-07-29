import { useEffect, useMemo, useState } from "react";
import { roommateMatchesApi } from "../api/roommateMatches";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import ScoreBadge from "../components/ScoreBadge";
import SkeletonCards from "../components/SkeletonCards";
import PageHeader from "../components/PageHeader";

const CURRENT_SEMESTER = "Fall";
const CURRENT_YEAR = new Date().getFullYear();

function formatBudget(match) {
  if (match.other_budget_min && match.other_budget_max) {
    return `$${match.other_budget_min} - $${match.other_budget_max} / month`;
  }

  return "Not specified";
}

function formatHousingInterest(value) {
  if (value === "on_campus") return "On-Campus";
  if (value === "off_campus") return "Off-Campus";
  if (value === "either") return "Either";
  return "Not specified";
}

function formatSleepSchedule(value) {
  if (value === "early_bird") return "Early Bird";
  if (value === "night_owl") return "Night Owl";
  if (value === "flexible") return "Flexible";
  return "Not specified";
}

function formatStudyHabits(value) {
  if (value === "in_room") return "Studies In Room";
  if (value === "library") return "Studies at Library";
  if (value === "flexible") return "Flexible";
  return "Not specified";
}

function getCompatibility(score) {
  return Math.round(Number(score) || 0);
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTraitTags(match) {
  const tags = [];

  if (match.other_cleanliness_level) {
    tags.push(`Clean ${match.other_cleanliness_level}/5`);
  }

  if (match.other_sleep_schedule) {
    tags.push(formatSleepSchedule(match.other_sleep_schedule));
  }

  if (match.other_noise_tolerance) {
    tags.push(`Noise ${match.other_noise_tolerance}/5`);
  }

  if (match.other_study_habits) {
    tags.push(formatStudyHabits(match.other_study_habits));
  }

  return tags.slice(0, 4);
}

function getStatus(match) {
  return String(match.status || "").toLowerCase();
}

function isAcceptedMatch(match) {
  return ["accepted", "matched", "approved"].includes(getStatus(match));
}

function isPendingRequest(match) {
  return ["pending", "requested", "sent", "pending_sent", "pending_received"].includes(
    getStatus(match)
  );
}

function getRequestDirection(match, user) {
  if (!match.requester_user_id) return "none";

  const currentUserId = user?.id || user?.user_id;
  return Number(match.requester_user_id) === Number(currentUserId)
    ? "outgoing"
    : "incoming";
}

function canMessageMatch(match) {
  return isAcceptedMatch(match);
}

function RoommateMatches() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingId, setRespondingId] = useState(null);
  const [analysisByMatch, setAnalysisByMatch] = useState({});
  const [analyzingId, setAnalyzingId] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    return (
        sessionStorage.getItem("roommateMatchesActiveTab") || "discover"
    );
  });
  const [viewingProfile, setViewingProfile] = useState(null);

function handleOpenChat(match) {
  if (!canMessageMatch(match)) {
    showToast(
      "Chat becomes available after a roommate match is accepted.",
      "info"
    );
    return;
  }

  navigate(`/messages/${match.match_id}`);
}

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
  sessionStorage.setItem("roommateMatchesActiveTab", activeTab);
  }, [activeTab]);

  const visibleMatches = useMemo(() => {
    const safeMatches = Array.isArray(matches) ? matches : [];

    if (activeTab === "discover") {
      return safeMatches.filter(
        (match) => getStatus(match) === "pending" && getRequestDirection(match, user) === "none"
      );
    }

    if (activeTab === "matches") {
      return safeMatches.filter((match) => isAcceptedMatch(match));
    }
  
    if (activeTab === "requests") {
      return safeMatches.filter(
        (match) =>
          isPendingRequest(match) &&
          getRequestDirection(match, user) === "incoming"
      );
    }
  
    if (activeTab === "sent") {
      return safeMatches.filter(
        (match) =>
          isPendingRequest(match) &&
          getRequestDirection(match, user) === "outgoing"
      );
    }
  
    return safeMatches;
  }, [matches, activeTab, user]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await roommateMatchesApi.getMine(CURRENT_SEMESTER, CURRENT_YEAR);
      setMatches(
  Array.isArray(data)
          ? data
          : Array.isArray(data?.matches)
            ? data.matches
            : []
);
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

  async function handleSendRequest(matchId) {
    setRespondingId(matchId);
    try {
      const updated = await roommateMatchesApi.sendRequest(matchId);
      const currentUserId = user?.id || user?.user_id;

      setMatches((prev) =>
          prev.map((m) =>
              m.match_id === matchId
                  ? {
            ...m,
            ...updated,
            status: updated?.status || "pending",
            requester_user_id:
              updated?.requester_user_id || currentUserId,
        }
      : m
  )
);
      setActiveTab("sent");
      showToast("Roommate request sent!", "success");
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
        title="Roommate Matching"
        subtitle="Based on your profile and preferences"
        icon="👥"
      >
        <div className="roommate-tabs">
          <button
            type="button"
            className={activeTab === "discover" ? "active" : ""}
            onClick={() => setActiveTab("discover")}
          >
            🔎 Discover
          </button>

          <button
            type="button"
            className={activeTab === "matches" ? "active" : ""}
            onClick={() => setActiveTab("matches")}
          >
            👥 Matches
          </button>

          <button
            type="button"
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            🧑‍🤝‍🧑 Requests
          </button>

          <button
            type="button"
            className={activeTab === "sent" ? "active" : ""}
            onClick={() => setActiveTab("sent")}
          >
            🎓 Sent
          </button>
        </div>
      </PageHeader>

      {loading && <SkeletonCards count={3} />}
      {error && (
        <p style={{ color: "crimson" }}>
          {error}
          {error.includes("Create a roommate profile") && (
            <> — <a href="/roommate-profile">create one here</a>.</>
          )}
        </p>
      )}

      {!loading && !error && visibleMatches.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <h3>No matches yet</h3>
          <p>
          {activeTab === "discover" &&
            "No new candidates right now — check back once more students fill out roommate profiles."}
          {activeTab === "matches" &&
            "No confirmed matches yet — accept a request or send one from Discover."}
          {activeTab === "requests" && "No incoming roommate requests right now."}
          {activeTab === "sent" && "You haven't sent any roommate requests yet."}
          </p>
        </div>
      )}

      {!loading && !error && visibleMatches.length > 0 && (
        <div className="roommate-match-list">
          {visibleMatches.map((match) => {
            const traits = getTraitTags(match);
            const compatibility = getCompatibility(match.compatibility_score);

            return (
              <div className="roommate-match-card" key={match.match_id}>
                <div className="roommate-profile-photo">
                  {match.other_profile_picture ? (
                    <img
                      src={match.other_profile_picture}
                      alt={`${match.other_user_name}'s profile`}
                    />
                  ) : (
                    <span>{getInitials(match.other_user_name)}</span>
                  )}
                </div>

                <div className="roommate-match-info">
                  <h2>{match.other_user_name}</h2>

                  <p className="roommate-meta">
                    🏫{" "}
                    {match.other_school_name ||
                      match.other_school ||
                      "School unavailable"}
                    {" · "}
                    {match.other_year || match.other_class_year || "Student"}
                    {" · "}
                    {match.other_major || "Major unavailable"}
                  </p>

                  <div className="roommate-tags">
                    {traits.length > 0 ? (
                      traits.map((trait) => <span key={trait}>{trait}</span>)
                    ) : (
                      <span>Profile preferences available</span>
                    )}
                  </div>

                  <p>
                    <strong>Budget:</strong> {formatBudget(match)}
                  </p>

                  <p>
                    <strong>Housing Interest:</strong>{" "}
                    {formatHousingInterest(match.other_housing_interest)}
                  </p>

                  {match.other_bio && (
                    <p className="roommate-bio">{match.other_bio}</p>
                  )}

                  {analysisByMatch[match.match_id] && (
                    <div className="roommate-ai-analysis">
                      <h3>AI Compatibility Analysis</h3>

                      <ScoreBadge
                        score={analysisByMatch[match.match_id].adjustedScore}
                      />

                      <p>
                        <strong>AI Adjustment:</strong>{" "}
                        {analysisByMatch[match.match_id].adjustment > 0
                          ? "+"
                          : ""}
                        {analysisByMatch[match.match_id].adjustment} points
                      </p>

                      <p>{analysisByMatch[match.match_id].explanation}</p>
                    </div>
                  )}
                </div>

                <div className="roommate-score-panel">
                  <h3>{compatibility}%</h3>
                  <p>Compatibility</p>

                  {activeTab === "discover" && (
                    <>
                      <button
                        type="button"
                        className="primary-btn"
                        disabled={respondingId === match.match_id}
                        onClick={() => handleSendRequest(match.match_id)}
                      >
                        {respondingId === match.match_id ? "Sending..." : "🤝 Send Request"}
                      </button>

                      <button
                        type="button"
                        className="secondary-btn"
                        disabled={analyzingId === match.match_id}
                        onClick={() => handleAnalysis(match.match_id)}
                      >
                        {analyzingId === match.match_id
                          ? "Analyzing..."
                          : "View AI Analysis"}
                      </button>
                    </>
                  )}

                    {activeTab === "requests" && (
                    <div className="roommate-action-stack">
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

                  {activeTab === "sent" && (
                    <button className="secondary-btn" disabled>
                      Request Sent
                    </button>
                  )}

                  {activeTab === "matches" && (
                    <>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => handleOpenChat(match)}
                      >
                        💬 Message Match
                      </button>

                      <button
                        type="button"
                        className="secondary-btn"
                        disabled={analyzingId === match.match_id}
                        onClick={() => handleAnalysis(match.match_id)}
                      >
                        {analyzingId === match.match_id
                          ? "Analyzing..."
                          : "View AI Analysis"}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="roommate-profile-link"
                    onClick={() => setViewingProfile(match)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="roommate-verified-note">
        All matches are based on verified profiles and preferences.
      </p>

      {viewingProfile && (
        <div
          className="profile-modal-overlay"
          onClick={() => setViewingProfile(null)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setViewingProfile(null)}
              aria-label="Close profile"
            >
              ✕
            </button>
            {analysisByMatch[viewingProfile.match_id] && (
                <div>
                    <h3>AI Compatibility Analysis</h3>
                    <p>
                        <strong>Original Score:</strong>{" "}
                        {analysisByMatch[viewingProfile.match_id].score}%
                    </p>
                    <p>
                        <strong>AI Adjustment: </strong>{" "}
                        {analysisByMatch[viewingProfile.match_id].adjustment > 0 ? "+" : ""}
                        {analysisByMatch[viewingProfile.match_id].adjustment} points
                    </p>
                    <p>
                        <strong>Adjusted Score:</strong>{" "}
                        {analysisByMatch[viewingProfile.match_id].adjustedScore}%
                    </p>
                    <p>{analysisByMatch[viewingProfile.match_id].explanation}</p>
                </div>
              )}

            <div className="roommate-profile-photo profile-modal-photo">
              {viewingProfile.other_profile_picture ? (
                <img
                  src={viewingProfile.other_profile_picture}
                  alt={`${viewingProfile.other_user_name}'s profile`}
                />
              ) : (
                <span>{getInitials(viewingProfile.other_user_name)}</span>
              )}
            </div>

            <h2>{viewingProfile.other_user_name}</h2>
            <p className="roommate-meta">
              🏫 {viewingProfile.other_school_name || "School unavailable"}
              {" · "}
              {viewingProfile.other_major || "Major unavailable"}
            </p>

            <div className="profile-modal-grid">
              <div>
                <strong>Budget</strong>
                <p>{formatBudget(viewingProfile)}</p>
              </div>
              <div>
                <strong>Housing Interest</strong>
                <p>{formatHousingInterest(viewingProfile.other_housing_interest)}</p>
              </div>
              <div>
                <strong>Sleep Schedule</strong>
                <p>{formatSleepSchedule(viewingProfile.other_sleep_schedule)}</p>
              </div>
              <div>
                <strong>Study Habits</strong>
                <p>{formatStudyHabits(viewingProfile.other_study_habits)}</p>
              </div>
              <div>
                <strong>Cleanliness</strong>
                <p>{viewingProfile.other_cleanliness_level ?? "—"}/5</p>
              </div>
              <div>
                <strong>Noise Tolerance</strong>
                <p>{viewingProfile.other_noise_tolerance ?? "—"}/5</p>
              </div>
              <div>
                <strong>Social Level</strong>
                <p>{viewingProfile.other_social_level ?? "—"}/5</p>
              </div>
              <div>
                <strong>Move-in Date</strong>
                <p>
                  {viewingProfile.other_move_in_date
                    ? new Date(viewingProfile.other_move_in_date).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
              <div>
                <strong>Smoking</strong>
                <p>{viewingProfile.other_smoking ? "Yes" : "No"}</p>
              </div>
              <div>
                <strong>Pets</strong>
                <p>{viewingProfile.other_pets ? "Yes" : "No"}</p>
              </div>
            </div>

            {viewingProfile.other_bio && (
              <div className="profile-modal-section">
                <strong>Bio</strong>
                <p>{viewingProfile.other_bio}</p>
              </div>
            )}

            {viewingProfile.other_roommate_pet_peeve && (
              <div className="profile-modal-section">
                <strong>Biggest roommate pet peeve</strong>
                <p>{viewingProfile.other_roommate_pet_peeve}</p>
              </div>
            )}

            {viewingProfile.other_conflict_style && (
              <div className="profile-modal-section">
                <strong>Conflict style</strong>
                <p>{viewingProfile.other_conflict_style}</p>
              </div>
            )}

            {viewingProfile.other_visitor_style && (
              <div className="profile-modal-section">
                <strong>Visitor style</strong>
                <p>{viewingProfile.other_visitor_style}</p>
              </div>
            )}

            {viewingProfile.other_boundaries && (
              <div className="profile-modal-section">
                <strong>Boundaries</strong>
                <p>{viewingProfile.other_boundaries}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default RoommateMatches;
