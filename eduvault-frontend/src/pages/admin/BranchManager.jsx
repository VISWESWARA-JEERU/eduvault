
import { useEffect, useState } from "react";
import API from "../../api/axios";

function BranchManager() {

  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch branches
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

  // Add branch
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

  // Delete branch
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
    <div>

      <h2>Branch Management</h2>

      {/* Add Branch */}
      <div>
        <input
          type="text"
          placeholder="Enter Branch Name"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />

        <button onClick={addBranch} disabled={loading}>
          {loading ? "Adding..." : "Add Branch"}
        </button>
      </div>

      {/* Branch List */}
      <ul>
        {branches.map((branch) => (
          <li key={branch.id}>

            {branch.branch_name}

            <button
              onClick={() => deleteBranch(branch.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default BranchManager;