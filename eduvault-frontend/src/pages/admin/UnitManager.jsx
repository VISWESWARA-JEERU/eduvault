import { useEffect, useState } from "react";
import API from "../../api/axios";

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
        subject_name: subjectName
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
    <div>

      <h3>Unit Manager</h3>

      {/* Unit Name */}
      <input
        type="text"
        placeholder="Unit Name"
        value={unitName}
        onChange={(e) => setUnitName(e.target.value)}
      />

      {/* Subject Dropdown */}
      <select
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      >
        <option value="">Select Subject</option>

        {subjects.map((s) => (
          <option key={s.id} value={s.subject_name}>
            {s.subject_name} ({s.semester_name})
          </option>
        ))}

      </select>

      <button onClick={handleAdd}>Add Unit</button>

      {/* Unit List */}
      <ul>

        {units.map((u) => (
          <li key={u.id}>

            {u.unit_name}
            {" "}
            (Subject: {u.subject_name})

            <button
              onClick={() => handleDelete(u.id)}
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

export default UnitManager;