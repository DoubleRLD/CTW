import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/dormscout-logo.png";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      // row with domain "gsu.edu" already exists in the database.
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
              Your school is detected from your email domain — make sure it matches your university's registered domain.
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
