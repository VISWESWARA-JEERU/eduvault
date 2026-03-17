import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      setError("Email and OTP are required ❌");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const { data } = await API.post("/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      setMessage(data.message || "Password reset successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Reset your password</h1>
        <p className="login-subtitle">
          Enter your email, the OTP sent to your email, and choose a new password.
        </p>

        {error && <p className="login-error">{error}</p>}
        {message && <p className="login-success">{message}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

