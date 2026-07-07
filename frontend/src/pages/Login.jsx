import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/dormscout-logo.png";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
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
          
          <h2>Welcome Back!</h2>
          
          <p>
            Log in to continue searching housing, reading reviews, and finding compatible roommates.
          </p>
        </section>

        <section className="auth-form-panel">

          <h1>Login</h1>

          <p className="form-helper">
            Enter your student account information to continue.
          </p>

          {error && <p style={{ color: "crimson" }}>{error}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch-text">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
