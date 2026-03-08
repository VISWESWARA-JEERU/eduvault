import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>EduVault 📚</h1>

      <p>
        EduVault is a centralized academic platform where students can access
        branch-wise, semester-wise, and subject-wise learning resources.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Select Role</h3>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/login", { state: { role } })}
          style={{ marginRight: "10px" }}
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register", { state: { role } })}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;