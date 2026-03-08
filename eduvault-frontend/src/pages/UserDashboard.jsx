
import { useState, useEffect } from "react";
import API from "../api/axios";

function UserDashboard() {
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    API.get("/branches").then(res => setBranches(res.data));
  }, []);

  return (
    <div>
      <h2>Select Academic Structure</h2>

      <select>
        <option>Select Branch</option>
        {branches.map(b => (
          <option key={b.id}>{b.name}</option>
        ))}
      </select>

      <select>
        <option>Select Year</option>
      </select>

      <select>
        <option>Select Semester</option>
      </select>

      <button>View Subjects</button>
    </div>
  );
}

export default UserDashboard;