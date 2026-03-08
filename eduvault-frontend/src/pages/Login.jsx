import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/login", { email, password, role });

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.role) localStorage.setItem("role", data.role);
        if (data.name) localStorage.setItem("name", data.name);
      }

      // Redirect based on role returned (fallback to selected role)
      const finalRole = data.role || role;
      if (finalRole === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>
          Role: 
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;