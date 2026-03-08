import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminDashboard() {

  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  API.get("/academic-tree")
    .then(res => setBranches(res.data))
    .catch(err => console.error(err));

     }, []);

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
    <div style={{ padding: "20px" }}>

      <h2>Welcome {name} 👋</h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h3>Admin Management</h3>

      <Link to="/create-admin">
        <button>Create Admin Account</button>
      </Link>

      <hr />

      <h3>Academic Management</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

        <Link to="/admin/branches">
          <button>Branches</button>
        </Link>

        <Link to="/admin/years">
          <button>Years</button>
        </Link>

        <Link to="/admin/semesters">
          <button>Semesters</button>
        </Link>

        <Link to="/admin/subjects">
          <button>Subjects</button>
        </Link>

        <Link to="/admin/units">
          <button>Units</button>
        </Link>

        <Link to="/admin/pdfs">
          <button>PDF Manager</button>
        </Link>

      </div>

      <hr />

      <h3>Registered Users</h3>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email}) - <b>{u.role}</b>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default AdminDashboard;