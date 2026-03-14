
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./CreateAdmin.css";

function CreateAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.role === "admin") {
        const res = await API.post("/register-admin", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        alert(res.data.message);
      } else {
        const res = await API.post("/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        alert(res.data.message);
      }

      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="create-admin-page">
      <div className="create-admin-card">
        <h1 className="create-admin-title">Create a new account</h1>
        <p className="create-admin-subtitle">
          Choose whether you want to create a student or admin account, then
          fill in the details below.
        </p>

        <div className="create-admin-form">
          <div className="create-admin-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="create-admin-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="create-admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@college.edu"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="create-admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="create-admin-button" onClick={handleSubmit}>
            Create account
          </button>

          <button
            type="button"
            className="create-admin-secondary"
            onClick={() => navigate("/admin")}
          >
            Back to admin dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAdmin;