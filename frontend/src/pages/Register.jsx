import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/dormscout-logo.png";

function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // holds the success response once registered

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Note: there's no free-text "School" field here — the backend
      // derives your school from your email domain (see
      // auth.controller.js), so "jane@gsu.edu" only works if a School
      // row with that domain already exists in the database.
      const data = await register(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // After a successful register, the account exists but can't log in
  // yet — show the "check your email" state instead of redirecting
  // straight to the dashboard.
  if (result) {
    return (
      <main className="page auth-page">
        <div className="auth-card">
          <section className="auth-brand-panel">
            <img src={logo} alt="DormScout logo" className="auth-brand-logo" />
            <h2>Almost there!</h2>
            <p>One more step before you can start browsing housing and finding roommates.</p>
          </section>

          <section className="auth-form-panel">
            <h1>Check your email</h1>
            <p className="form-helper">{result.message}</p>
            <p className="small-text">
              We sent a verification link to <strong>{form.email}</strong>. Click it to
              activate your account, then come back and log in.
            </p>

            {/* devVerificationLink only exists when the backend is running in
                EMAIL_PROVIDER=console mode (local dev) — never in production. */}
            {result.devVerificationLink && (
              <div className="card">
                <p className="small-text">
                  <strong>Dev mode:</strong> no real email was sent. Use this link directly:
                </p>
                <a href={result.devVerificationLink}>{result.devVerificationLink}</a>
              </div>
            )}

            <p className="auth-switch-text">
              <Link to="/login">Back to login</Link>
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <section className="auth-brand-panel">
          <img src={logo} alt="DormScout logo" className="auth-brand-logo" />

          <h2>Join DormScout</h2>

          <p>
            Create an account to compare housing, save listings, write reviews, and build your roommate profile.
          </p>
        </section>

        <section className="auth-form-panel">

          <h1>Create Student Account</h1>

          <p className="form-helper">
            Sign up with your student email to start using DormScout.
          </p>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />

            <label>Student Email</label>
            <input
              type="email"
              placeholder="Enter your school email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />

            <p className="small-text">
              Your school is detected from your email domain — make sure it matches your
              university's registered domain. You'll need to click a verification link
              sent to this address before you can log in.
            </p>

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password (min 8 characters)"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={8}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Register;
