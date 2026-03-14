import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-header">
          <div className="admin-title-block">
            <h2>Welcome, {name} 👋</h2>
            <p>Manage branches, years, semesters, subjects, units, PDFs and users.</p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-grid">
          <div className="admin-card">
            <h3>Admin Management</h3>
            <p className="admin-section-title">Admin tools</p>
            <Link to="/create-admin">
              <button className="admin-create-btn">Create admin account</button>
            </Link>
          </div>

          <div className="admin-card">
            <h3>Academic Management</h3>
            <p className="admin-section-title">Navigate to modules</p>
            <div className="admin-pill-row">
              <Link to="/admin/branches">
                <button className="admin-pill">Branches</button>
              </Link>
              <Link to="/admin/years">
                <button className="admin-pill">Years</button>
              </Link>
              <Link to="/admin/semesters">
                <button className="admin-pill">Semesters</button>
              </Link>
              <Link to="/admin/subjects">
                <button className="admin-pill">Subjects</button>
              </Link>
              <Link to="/admin/units">
                <button className="admin-pill">Units</button>
              </Link>
              <Link to="/admin/pdfs">
                <button className="admin-pill">PDF Manager</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 18 }}>
          <h3>Registered users</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <ul className="admin-list">
              {users.map((u) => (
                <li key={u.id}>
                  <span>
                    {u.name} ({u.email}){" "}
                    <span className="admin-tag">{u.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;