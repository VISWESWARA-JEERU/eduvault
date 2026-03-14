import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Admin.css";

function UnitManager() {
  const [units, setUnits] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [unitName, setUnitName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const fetchData = async () => {
    try {
      const unit = await API.get("/units");
      const sub = await API.get("/subjects");

      setUnits(unit.data);
      setSubjects(sub.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!unitName.trim()) {
      alert("Enter unit name ❌");
      return;
    }

    if (!subjectName) {
      alert("Select subject ❌");
      return;
    }

    try {
      await API.post("/units", {
        unit_name: unitName,
        subject_name: subjectName,
      });

      setUnitName("");
      setSubjectName("");
      fetchData();
    } catch (err) {
      console.error("Error adding unit:", err);
      alert("Failed to add unit ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/units/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting unit:", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>Unit manager</h3>
          <p className="admin-section-title">
            Organize content units under each subject.
          </p>

          <div className="admin-input-row">
            <input
              className="admin-input"
              type="text"
              placeholder="Unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />

            <select
              className="admin-select"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.subject_name}>
                  {s.subject_name} ({s.semester_name})
                </option>
              ))}
            </select>

            <button className="admin-primary-btn" onClick={handleAdd}>
              Add unit
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 14 }}>
            {units.map((u) => (
              <li key={u.id}>
                <div>
                  <div className="admin-unit-title">{u.unit_name}</div>
                  <div className="admin-unit-meta">
                    {u.subject_name} • {u.semester_name}
                    {u.branch_name ? ` - ${u.branch_name}` : ""}
                    {u.year_name ? ` (${u.year_name})` : ""}
                  </div>
                </div>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(u.id)}
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

export default UnitManager;