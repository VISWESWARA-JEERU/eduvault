import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const { data } = await API.post("/login", { email, password, role });

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.role) localStorage.setItem("role", data.role);
        if (data.name) localStorage.setItem("name", data.name);
        if (data.id) localStorage.setItem("id", data.id);
      }

      const finalRole = data.role || role;
      if (finalRole === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome back to EduVault</h1>
        <p className="login-subtitle">
          Sign in to access your personalized academic dashboard and resources.
        </p>

        {error && <p className="login-error">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-forgot-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          New to EduVault?{" "}
          <button
            type="button"
            className="login-link-button"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;