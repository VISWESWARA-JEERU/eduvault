import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import DrawerMenu from "../../components/DrawerMenu";
import "./Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("id");
  const isSuperAdmin = userId === "1";

  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const adminRef = useRef(null);
  const userRef = useRef(null);
  const academicRef = useRef(null);
  const adminsListRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await API.get("/users");
      // Filter users and admins
      const adminsList = res.data.filter((u) => u.role === "admin");
      const usersList = res.data.filter((u) => u.role === "user");
      setAdmins(adminsList);
      setUsers(usersList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await API.delete(`/admins/${id}`);
      alert("Admin deleted successfully ✅");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete admin ❌");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      alert("User deleted successfully ✅");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user ❌");
    }
  };

  return (
    <div className="admin-page">
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Admin Navigation"
        items={[
          ...(isSuperAdmin ? [{ label: "Admin tools", onClick: () => scrollTo(adminRef) }] : []),
          ...(!isSuperAdmin ? [{ label: "User tools", onClick: () => scrollTo(userRef) }] : []),
          { label: "Academic modules", onClick: () => scrollTo(academicRef) },
          ...(isSuperAdmin ? [{ label: "Admins list", onClick: () => scrollTo(adminsListRef) }] : []),
          { label: "Logout", onClick: handleLogout },
        ]}
      />

      <div className="admin-shell">
        <div className="admin-header">
          <button
            className="hamburger-btn"
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </button>

          <div className="admin-title-block">
            <h2>Welcome, {name} 👋</h2>
            <p>
              {isSuperAdmin
                ? "Manage admins, branches, years, semesters, subjects, units, and PDFs."
                : "Manage users, branches, years, semesters, subjects, units, and PDFs."}
            </p>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-grid">
          {isSuperAdmin && (
            <div className="admin-card" ref={adminRef}>
              <h3>Admin Management</h3>
              <p className="admin-section-title">SuperAdmin tools</p>
              <Link to="/create-admin">
                <button className="admin-create-btn">Create admin account</button>
              </Link>
            </div>
          )}

          {!isSuperAdmin && (
            <div className="admin-card" ref={userRef}>
              <h3>User Management</h3>
              <p className="admin-section-title">Manage student accounts</p>
              <Link to="/admin/users">
                <button className="admin-create-btn">Manage users</button>
              </Link>
            </div>
          )}

          <div className="admin-card" ref={academicRef}>
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

        {isSuperAdmin && (
          <div className="admin-card" ref={adminsListRef} style={{ marginTop: 18 }}>
            <h3>Registered admins</h3>
            {loading ? (
              <p>Loading admins...</p>
            ) : admins.length === 0 ? (
              <p>No admins found</p>
            ) : (
              <ul className="admin-list">
                {admins.map((admin) => (
                  <li key={admin.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>
                      {admin.name} ({admin.email}){" "}
                      <span className="admin-tag">{admin.role}</span>
                    </span>
                    {admin.id !== userId && (
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;