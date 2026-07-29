import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { moderationApi } from "../api/moderation";
import { adminUsersApi } from "../api/adminUsers";
import { schoolsApi } from "../api/school";
import { dormsApi } from "../api/dorms";
import { listingsApi } from "../api/listings";
import PageHeader from "../components/PageHeader";
import SkeletonCards from "../components/SkeletonCards";
import StarRating from "../components/StarRating";

const TABS = [
  { id: "reports", label: "🚩 Reports" },
  { id: "users", label: "👥 Users" },
  { id: "schools", label: "🏫 Schools" },
  { id: "dorms", label: "🏠 Dorms" },
  { id: "listings", label: "🏢 Listings" },
];

function Admin() {
  const { isAuthenticated, user, checkingAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("reports");

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
        title="Admin Console"
        subtitle="Manage reports, users, schools, dorms, and listings."
        icon="🛠️"
      >
        <div className="roommate-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {activeTab === "reports" && <ReportsTab />}
      {activeTab === "users" && <UsersTab currentUserId={user.user_id} />}
      {activeTab === "schools" && <SchoolsTab />}
      {activeTab === "dorms" && <DormsTab />}
      {activeTab === "listings" && <ListingsTab />}
    </main>
  );
}

// ---------- Reports ----------

function ReportsTab() {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setReports(await moderationApi.listReports());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(reportId, action) {
    if (action === "remove" && !window.confirm("Remove this review permanently?")) return;

    setResolvingId(reportId);
    try {
      await moderationApi.resolveReport(reportId, action);
      setReports((prev) => prev.filter((r) => r.report_id !== reportId));
      showToast(action === "remove" ? "Review removed." : "Report dismissed.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setResolvingId(null);
    }
  }

  if (loading) return <SkeletonCards count={3} />;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  if (reports.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✅</div>
        <h3>No open reports</h3>
        <p>Nothing flagged right now — all clear.</p>
      </div>
    );
  }

  return (
    <div className="admin-reports-list">
      {reports.map((report) => (
        <div className="card admin-report-card" key={report.report_id}>
          <div className="admin-report-meta">
            <span className="admin-report-type">
              {report.review_type === "dorm" ? "🏠 Dorm" : "🏢 Off-Campus"} · {report.context_name}
            </span>
            <StarRating rating={report.overall_rating} />
          </div>

          <p><strong>Review by:</strong> {report.review_author_name}</p>
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
  );
}

// ---------- Users ----------

function UsersTab({ currentUserId }) {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setUsers(await adminUsersApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBan(u) {
    const nextBanned = !u.is_banned;
    if (nextBanned && !window.confirm(`Ban ${u.name}? They'll lose access immediately.`)) return;

    setBusyId(u.user_id);
    try {
      await adminUsersApi.setBanned(u.user_id, nextBanned);
      setUsers((prev) =>
        prev.map((x) => (x.user_id === u.user_id ? { ...x, is_banned: nextBanned } : x))
      );
      showToast(nextBanned ? `${u.name} banned.` : `${u.name} unbanned.`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleAdmin(u) {
    const nextAdmin = !u.is_admin;
    if (!window.confirm(`${nextAdmin ? "Promote" : "Demote"} ${u.name}?`)) return;

    setBusyId(u.user_id);
    try {
      await adminUsersApi.setAdmin(u.user_id, nextAdmin);
      setUsers((prev) =>
        prev.map((x) => (x.user_id === u.user_id ? { ...x, is_admin: nextAdmin } : x))
      );
      showToast(nextAdmin ? `${u.name} is now an admin.` : `${u.name} is no longer an admin.`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <SkeletonCards count={3} />;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>School</th>
            <th>Verified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.school_name || "—"}</td>
              <td>{u.email_verified ? "✅" : "—"}</td>
              <td>
                {u.is_admin && <span className="admin-badge admin-badge-admin">Admin</span>}
                {u.is_banned && <span className="admin-badge admin-badge-banned">Banned</span>}
                {!u.is_admin && !u.is_banned && <span className="muted-text">Student</span>}
              </td>
              <td className="admin-table-actions">
                {u.user_id === currentUserId ? (
                  <span className="muted-text">(you)</span>
                ) : (
                  <>
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={busyId === u.user_id}
                      onClick={() => toggleAdmin(u)}
                    >
                      {u.is_admin ? "Demote" : "Promote"}
                    </button>
                    <button
                      type="button"
                      className={u.is_banned ? "primary-btn" : "secondary-btn admin-remove-btn"}
                      disabled={busyId === u.user_id}
                      onClick={() => toggleBan(u)}
                    >
                      {u.is_banned ? "Unban" : "Ban"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Schools ----------

function SchoolsTab() {
  const { showToast } = useToast();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDomains, setNewDomains] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setSchools(await schoolsApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const domains = newDomains
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      await schoolsApi.create({ name: newName.trim(), domains });
      setNewName("");
      setNewDomains("");
      showToast("School added.", "success");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(school) {
    const name = window.prompt("New school name:", school.name);
    if (!name || !name.trim() || name === school.name) return;

    setBusyId(school.school_id);
    try {
      await schoolsApi.update(school.school_id, name.trim());
      setSchools((prev) =>
        prev.map((s) => (s.school_id === school.school_id ? { ...s, name: name.trim() } : s))
      );
      showToast("School renamed.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleAddDomain(school) {
    const domain = window.prompt(`Add a student email domain for ${school.name}:`);
    if (!domain || !domain.trim()) return;

    setBusyId(school.school_id);
    try {
      await schoolsApi.addDomain(school.school_id, domain.trim());
      showToast("Domain added.", "success");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(school) {
    if (!window.confirm(`Delete ${school.name}? This can't be undone.`)) return;

    setBusyId(school.school_id);
    try {
      await schoolsApi.delete(school.school_id);
      setSchools((prev) => prev.filter((s) => s.school_id !== school.school_id));
      showToast("School deleted.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <form className="admin-inline-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="School name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email domains, comma-separated (e.g. gsu.edu, students.gsu.edu)"
          value={newDomains}
          onChange={(e) => setNewDomains(e.target.value)}
        />
        <button type="submit" className="primary-btn" disabled={creating}>
          {creating ? "Adding..." : "Add School"}
        </button>
      </form>

      {loading && <SkeletonCards count={3} />}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Domains</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr key={s.school_id}>
                  <td>{s.name}</td>
                  <td>{s.domains || "—"}</td>
                  <td>{s.user_count}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={busyId === s.school_id}
                      onClick={() => handleRename(s)}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={busyId === s.school_id}
                      onClick={() => handleAddDomain(s)}
                    >
                      + Domain
                    </button>
                    <button
                      type="button"
                      className="secondary-btn admin-remove-btn"
                      disabled={busyId === s.school_id}
                      onClick={() => handleDelete(s)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Dorms ----------

function DormsTab() {
  const { showToast } = useToast();
  const [schools, setSchools] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    schoolsApi.list().then(setSchools).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolFilter]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setDorms(await dormsApi.list(schoolFilter || undefined));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(dorm) {
    const name = window.prompt("Dorm name:", dorm.name);
    if (!name || !name.trim()) return;
    const address = window.prompt("Address:", dorm.address || "");

    setBusyId(dorm.dorm_id);
    try {
      await dormsApi.update(dorm.dorm_id, { name: name.trim(), address: address?.trim() || undefined });
      showToast("Dorm updated.", "success");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(dorm) {
    if (!window.confirm(`Delete ${dorm.name}? This removes its rooms and reviews too.`)) return;

    setBusyId(dorm.dorm_id);
    try {
      await dormsApi.delete(dorm.dorm_id);
      setDorms((prev) => prev.filter((d) => d.dorm_id !== dorm.dorm_id));
      showToast("Dorm deleted.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="admin-filter-row">
        <select value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
          <option value="">All schools</option>
          {schools.map((s) => (
            <option key={s.school_id} value={s.school_id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading && <SkeletonCards count={3} />}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>School</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((d) => (
                <tr key={d.dorm_id}>
                  <td>{d.name}</td>
                  <td>{d.address || "—"}</td>
                  <td>{d.school_name}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={busyId === d.dorm_id}
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="secondary-btn admin-remove-btn"
                      disabled={busyId === d.dorm_id}
                      onClick={() => handleDelete(d)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Listings ----------

function ListingsTab() {
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setListings(await listingsApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditRent(listing) {
    const rent = window.prompt("Monthly rent ($):", listing.monthly_rent);
    if (!rent || isNaN(Number(rent))) return;

    setBusyId(listing.listing_id);
    try {
      await listingsApi.update(listing.listing_id, { monthlyRent: Number(rent) });
      showToast("Listing updated.", "success");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(listing) {
    if (!window.confirm(`Delete this listing at ${listing.address}? This removes its reviews too.`)) return;

    setBusyId(listing.listing_id);
    try {
      await listingsApi.delete(listing.listing_id);
      setListings((prev) => prev.filter((l) => l.listing_id !== listing.listing_id));
      showToast("Listing deleted.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <SkeletonCards count={3} />;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Bed/Bath</th>
            <th>Rent/mo</th>
            <th>Schools</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.listing_id}>
              <td>{l.name || l.address}</td>
              <td>{l.bedrooms} bd / {l.bathrooms} ba</td>
              <td>${Number(l.monthly_rent).toLocaleString()}</td>
              <td>{l.school_names || "—"}</td>
              <td className="admin-table-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={busyId === l.listing_id}
                  onClick={() => handleEditRent(l)}
                >
                  Edit Rent
                </button>
                <button
                  type="button"
                  className="secondary-btn admin-remove-btn"
                  disabled={busyId === l.listing_id}
                  onClick={() => handleDelete(l)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
