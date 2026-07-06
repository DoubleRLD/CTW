import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <main className="page">
      <div className="card">
        <h1>Create Student Account</h1>

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
            Your school is detected from your email domain — make sure it matches
            your university's registered domain.
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
      </div>
    </main>
  );
}

export default Register;
