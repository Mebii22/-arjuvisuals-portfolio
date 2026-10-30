import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SEO from "../../components/SEO";

export default function AdminLogin() {
  const { isAuthed, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthed) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Could not enter the desk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Administrator login" />
      <div className="login-screen login-b">
        <div className="login-brand">
          <Link to="/" className="wordmark">
            ARJU VISUALS<span className="co">.CO</span>
          </Link>
          <p>Public site stays open. This desk is private.</p>
        </div>

        <motion.form
          className="login-card"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="hex-pill">Sole administrator</span>
          <h1>STUDIO DESK</h1>
          <p className="login-lead">
            For <strong>Arjun Murali</strong> only. There is no public registration and no extra admin
            accounts. Visitors can browse the portfolio and send inquiries without logging in.
          </p>

          <div className="form-note" style={{ marginBottom: "1.2rem" }}>
            Frontend prototype — this form does not verify a real password and is not secure.
            A future Node.js / Express backend will authenticate the single authorised administrator.
          </div>

          <div className="field">
            <label htmlFor="email">Administrator email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label htmlFor="password">Password</label>
            <div className="pw-wrap">
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="error" style={{ color: "#8b2e2e", marginTop: "0.8rem" }}>
              {error}
            </p>
          )}
          <button
            className="btn btn-cyprus"
            type="submit"
            disabled={loading}
            style={{ marginTop: "1.6rem", width: "100%", justifyContent: "center" }}
          >
            {loading ? "Opening desk…" : "Enter as administrator"}
          </button>
          <p className="login-foot">
            No sign-up. One seat. Prototype session is stored in this browser only — not a real login.
          </p>
        </motion.form>
      </div>
    </>
  );
}
