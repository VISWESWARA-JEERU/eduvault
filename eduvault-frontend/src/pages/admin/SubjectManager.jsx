import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const sub = await API.get("/subjects");
      const sem = await API.get("/semesters");

      setSubjects(sub.data);
      setSemesters(sem.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!subjectName.trim()) {
      setError("Enter subject name ❌");
      return;
    }

    if (!semesterId) {
      setError("Select semester ❌");
      return;
    }

    try {
      setError("");

      await API.post("/subjects", {
        subject_name: subjectName,
        semester_name: semesterId,
      });

      setSubjectName("");
      setSemesterId("");
      fetchData();
    } catch (err) {
      console.error("Error adding subject:", err);
      setError(
        err.response?.data?.message || "Failed to add subject ❌"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/subjects/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>Subject manager</h3>
          <p className="admin-section-title">
            Add and manage subjects under each semester.
          </p>

          {error && <p className="admin-error-text">{error}</p>}

          <div className="admin-input-row">
            <input
              className="admin-input"
              type="text"
              placeholder="Subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <select
              className="admin-select"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
            >
              <option value="">Select semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.semester_name}>
                  {s.semester_name}
                  {s.branch_name ? ` - ${s.branch_name}` : ""}
                  {s.year_name ? ` (${s.year_name})` : ""}
                </option>
              ))}
            </select>

            <button className="admin-primary-btn" onClick={handleAdd}>
              Add subject
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 14 }}>
            {subjects.map((s) => (
              <li key={s.id}>
                <span>
                  {s.subject_name}{" "}
                  <span className="admin-tag">
                    Semester: {s.semester_name}
                    {s.branch_name ? ` - ${s.branch_name}` : ""}
                    {s.year_name ? ` (${s.year_name})` : ""}
                  </span>
                </span>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(s.id)}
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

export default SubjectManager;

