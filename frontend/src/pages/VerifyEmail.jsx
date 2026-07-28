import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/dormscout-logo.png";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [error, setError] = useState(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No verification token found in the link.");
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/dashboard"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleResend(e) {
    e.preventDefault();
    setResendStatus("sending");
    try {
      const data = await resendVerification(resendEmail);
      setResendStatus(data.devVerificationLink ? data.devVerificationLink : "sent");
    } catch (err) {
      setResendStatus("error:" + err.message);
    }
  }

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <section className="auth-brand-panel">
          <img src={logo} alt="DormScout logo" className="auth-brand-logo" />
          <h2>DormScout</h2>
          <p>Confirming it's really you before we let you in.</p>
        </section>

        <section className="auth-form-panel">
          {status === "verifying" && <p>Verifying your email...</p>}

          {status === "success" && (
            <>
              <h1>Email verified!</h1>
              <p className="form-helper">Redirecting you to your dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <h1>Verification failed</h1>
              <p style={{ color: "crimson" }}>{error}</p>

              <p className="small-text">
                Links expire after 24 hours, or may have already been used. Request a
                new one below.
              </p>

              <form className="form" onSubmit={handleResend}>
                <label>Email</label>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Your school email"
                  required
                />
                <button type="submit" disabled={resendStatus === "sending"}>
                  {resendStatus === "sending" ? "Sending..." : "Resend verification email"}
                </button>
              </form>

              {resendStatus === "sent" && (
                <p className="small-text">Check your email for a new link.</p>
              )}
              {resendStatus?.startsWith("http") && (
                <div className="card">
                  <p className="small-text"><strong>Dev mode:</strong> use this link directly:</p>
                  <a href={resendStatus}>{resendStatus}</a>
                </div>
              )}
              {resendStatus?.startsWith("error:") && (
                <p style={{ color: "crimson" }}>{resendStatus.slice(6)}</p>
              )}

              <p className="auth-switch-text">
                <Link to="/login">Back to login</Link>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default VerifyEmail;
