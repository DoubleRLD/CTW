import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { moderationApi } from "../api/moderation";
import PageHeader from "../components/PageHeader";
import SkeletonCards from "../components/SkeletonCards";
import StarRating from "../components/StarRating";

function AdminReports() {
  const { isAuthenticated, user, checkingAuth } = useAuth();
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await moderationApi.listReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(reportId, action) {
    if (
      action === "remove" &&
      !window.confirm("Remove this review permanently? This can't be undone.")
    ) {
      return;
    }

    setResolvingId(reportId);
    try {
      await moderationApi.resolveReport(reportId, action);
      setReports((prev) => prev.filter((r) => r.report_id !== reportId));
      showToast(
        action === "remove" ? "Review removed." : "Report dismissed.",
        "success"
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setResolvingId(null);
    }
  }

  if (checkingAuth) return <main className="page"><p>Loading...</p></main>;

  if (!isAuthenticated || !user?.is_admin) {
    return (
      <main className="page">
        <div className="card logged-out-card">
          <h1>Admin Access Required</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <PageHeader
        title="Review Reports"
        subtitle="Flagged reviews awaiting moderation."
        icon="🚩"
      />

      {loading && <SkeletonCards count={3} />}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>No open reports</h3>
          <p>Nothing flagged right now — all clear.</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="admin-reports-list">
          {reports.map((report) => (
            <div className="card admin-report-card" key={report.report_id}>
              <div className="admin-report-meta">
                <span className="admin-report-type">
                  {report.review_type === "dorm" ? "🏠 Dorm" : "🏢 Off-Campus"} ·{" "}
                  {report.context_name}
                </span>
                <StarRating rating={report.overall_rating} />
              </div>

              <p>
                <strong>Review by:</strong> {report.review_author_name}
              </p>
              <p className="admin-report-body">{report.review_body}</p>

              <div className="admin-report-reason">
                <strong>Reported by {report.reporter_name}:</strong>
                <p>{report.reason}</p>
              </div>

              <div className="admin-report-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={resolvingId === report.report_id}
                  onClick={() => handleResolve(report.report_id, "dismiss")}
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  className="primary-btn admin-remove-btn"
                  disabled={resolvingId === report.report_id}
                  onClick={() => handleResolve(report.report_id, "remove")}
                >
                  Remove Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminReports;
