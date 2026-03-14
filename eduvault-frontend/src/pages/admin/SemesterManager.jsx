import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function SemesterManager() {
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [semesterName, setSemesterName] = useState("");
  const [yearId, setYearId] = useState("");

  const fetchData = async () => {
    try {
      const sem = await API.get("/semesters");
      const yr = await API.get("/years");
      setSemesters(sem.data);
      setYears(yr.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!semesterName.trim()) {
      alert("Enter semester name ❌");
      return;
    }

    if (!yearId) {
      alert("Select year ❌");
      return;
    }

    try {
      await API.post("/semesters", {
        semester_name: semesterName,
        year_id: Number(yearId),
      });

      setSemesterName("");
      setYearId("");
      fetchData();
    } catch (err) {
      console.error("Error adding semester:", err);
      alert("Failed to add semester ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/semesters/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting semester:", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>Semester manager</h3>
          <p className="admin-section-title">
            Connect semesters to their academic years.
          </p>

          <div className="admin-input-row">
            <input
              className="admin-input"
              type="text"
              placeholder="Semester name"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
            />

            <select
              className="admin-select"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_name} ({year.branch_name})
                </option>
              ))}
            </select>

            <button className="admin-primary-btn" onClick={handleAdd}>
              Add semester
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 14 }}>
            {semesters.map((semester) => (
              <li key={semester.id}>
                <span>
                  {semester.semester_name}{" "}
                  <span className="admin-tag">
                    Year: {semester.year_name} - {semester.branch_name}
                  </span>
                </span>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(semester.id)}
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

export default SemesterManager;