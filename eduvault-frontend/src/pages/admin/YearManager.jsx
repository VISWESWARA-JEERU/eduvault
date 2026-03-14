import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function YearManager() {
  const [years, setYears] = useState([]);
  const [yearName, setYearName] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");

  const fetchYears = async () => {
    try {
      const res = await API.get("/years");
      setYears(res.data);
    } catch (err) {
      console.error("Error fetching years:", err);
    }
  };

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
        branch_name: branchName,
      });

      setYearName("");
      setBranchName("");
      fetchYears();
    } catch (err) {
      console.error("Error adding year:", err);
      alert("Failed to add year ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/years/${id}`);
      fetchYears();
    } catch (err) {
      console.error("Error deleting year:", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>Year manager</h3>
          <p className="admin-section-title">
            Link academic years to their corresponding branches.
          </p>

          <div className="admin-input-row">
            <select
              className="admin-select"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.branch_name}>
                  {branch.branch_name}
                </option>
              ))}
            </select>

            <input
              className="admin-input"
              type="text"
              placeholder="Year name"
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
            />

            <button className="admin-primary-btn" onClick={handleAdd}>
              Add year
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 14 }}>
            {years.map((year) => (
              <li key={year.id}>
                <span>
                  {year.year_name}{" "}
                  <span className="admin-tag">Branch: {year.branch_name}</span>
                </span>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(year.id)}
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

export default YearManager;