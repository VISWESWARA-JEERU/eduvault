import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "../CreateAdmin.css";

function UserManager() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert(res.data.message);
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  if (userRole !== "admin") {
    navigate("/admin");
    return null;
  }

  return (
    <div className="create-admin-page">
      <div className="create-admin-card">
        <h1 className="create-admin-title">Create a new student account</h1>
        <p className="create-admin-subtitle">
          Fill in the details below to create a student account.
        </p>

        <div className="create-admin-form">
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
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="create-admin-submit-btn" onClick={handleSubmit}>
            Create Student Account
          </button>
        </div>

        <button
          className="create-admin-back-btn"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default UserManager;