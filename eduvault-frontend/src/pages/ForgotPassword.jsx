import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  // State management
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const { data } = await API.post("/forgot-password", { email });
      setMessage(data.message || "OTP sent to your email ✅");
      
      setTimeout(() => {
        setStep(2);
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const { data } = await API.post("/verify-otp", { email, otp });
      setMessage(data.message || "OTP verified successfully ✅");
      
      setTimeout(() => {
        setStep(3);
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters ❌");
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

  // Cancel and go back to login
  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {step === 1 && (
          <>
            <h1 className="login-title">Forgot Password</h1>
            <p className="login-subtitle">
              Enter your registered email address and we'll send you an OTP to reset your password.
            </p>

            {error && <p className="login-error">{error}</p>}
            {message && <p className="login-success">{message}</p>}

            <form className="login-form" onSubmit={handleSendOtp}>
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

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>

            <p className="login-footer">
              Remember your password?{" "}
              <button
                type="button"
                className="login-link-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="login-title">Verify OTP</h1>
            <p className="login-subtitle">
              Enter the 6-digit OTP sent to {email}
            </p>

            {error && <p className="login-error">{error}</p>}
            {message && <p className="login-success">{message}</p>}

            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="login-field">
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength="6"
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="login-footer">
              <button
                type="button"
                className="login-link-button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
              >
                Use a different email
              </button>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="login-title">Set New Password</h1>
            <p className="login-subtitle">
              Create a strong password for your EduVault account.
            </p>

            {error && <p className="login-error">{error}</p>}
            {message && <p className="login-success">{message}</p>}

            <form className="login-form" onSubmit={handleResetPassword}>
              <div className="login-field">
                <label htmlFor="password">New Password</label>
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
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-button-group" style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="login-button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: "#6c757d" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
