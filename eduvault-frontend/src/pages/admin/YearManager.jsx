
import { useEffect, useState } from "react";
import API from "../../api/axios";

function YearManager() {

  const [years, setYears] = useState([]);
  const [yearName, setYearName] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");

  // Fetch years
  const fetchYears = async () => {
    try {
      const res = await API.get("/years");
      setYears(res.data);
    } catch (err) {
      console.error("Error fetching years:", err);
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const res = await API.get("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  useEffect(() => {
    fetchYears();
    fetchBranches();
  }, []);

  // Add year
  const handleAdd = async () => {

    if (!yearName.trim()) {
      return alert("Enter year name ❌");
    }

    if (!branchName) {
      return alert("Select branch ❌");
    }

    try {

      await API.post("/years", {
        year_name: yearName,
        branch_name: branchName
      });

      setYearName("");
      setBranchName("");
      fetchYears();

    } catch (err) {
      console.error("Error adding year:", err);
      alert("Failed to add year ❌");
    }
  };

  // Delete year
  const handleDelete = async (id) => {
    try {
      await API.delete(`/years/${id}`);
      fetchYears();
    } catch (err) {
      console.error("Error deleting year:", err);
    }
  };

  return (
    <div>

      <h3>Year Manager</h3>

      {/* Branch Dropdown */}
      <select
        value={branchName}
        onChange={(e) => setBranchName(e.target.value)}
      >
        <option value="">Select Branch</option>

        {branches.map((branch) => (
          <option key={branch.id} value={branch.branch_name}>
            {branch.branch_name}
          </option>
        ))}

      </select>

      {/* Year Input */}
      <input
        type="text"
        placeholder="Year Name"
        value={yearName}
        onChange={(e) => setYearName(e.target.value)}
      />

      <button onClick={handleAdd}>Add Year</button>

      {/* Year List */}
      <ul>

        {years.map((year) => (
          <li key={year.id}>

            {year.year_name} 
            {" "}
            (Branch: {year.branch_name})

            <button
              onClick={() => handleDelete(year.id)}
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

export default YearManager;