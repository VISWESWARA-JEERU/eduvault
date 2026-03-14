import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function BranchManager() {
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      const res = await API.get("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      alert("Failed to load branches ❌");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const addBranch = async () => {
    if (!branchName.trim()) {
      alert("Branch name cannot be empty ❌");
      return;
    }

    try {
      setLoading(true);

      await API.post("/branches", {
        branch_name: branchName.trim(),
      });

      setBranchName("");
      fetchBranches();
    } catch (err) {
      console.error("Error adding branch:", err);
      alert("Failed to add branch ❌");
    } finally {
      setLoading(false);
    }
  };

  const deleteBranch = async (id) => {
    try {
      await API.delete(`/branches/${id}`);
      fetchBranches();
    } catch (err) {
      console.error("Error deleting branch:", err);
      alert("Failed to delete branch ❌");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>Branch management</h3>
          <p className="admin-section-title">
            Create and maintain academic branches.
          </p>

          <div className="admin-input-row">
            <input
              className="admin-input"
              type="text"
              placeholder="Enter branch name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />

            <button
              className="admin-primary-btn"
              onClick={addBranch}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add branch"}
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 14 }}>
            {branches.map((branch) => (
              <li key={branch.id}>
                <span>{branch.branch_name}</span>
                <button
                  className="admin-delete-btn"
                  onClick={() => deleteBranch(branch.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BranchManager;