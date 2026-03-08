
import { useEffect, useState } from "react";
import API from "../../api/axios";

function SubjectManager() {

  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [semesterId, setSemesterId] = useState("");

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
      alert("Enter subject name ❌");
      return;
    }

    if (!semesterId) {
      alert("Select semester ❌");
      return;
    }

    try {

      await API.post("/subjects", {
        subject_name: subjectName,
        semester_id: semesterId
      });

      setSubjectName("");
      setSemesterId("");
      fetchData();

    } catch (err) {
      console.error("Error adding subject:", err);
      alert("Failed to add subject ❌");
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
    <div>

      <h3>Subject Manager</h3>

      {/* Subject Name Input */}
      <input
        type="text"
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />

      {/* Semester Dropdown */}
      <select
        value={semesterId}
        onChange={(e) => setSemesterId(e.target.value)}
      >
        <option value="">Select Semester</option>

        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.semester_name}
          </option>
        ))}

      </select>

      <button onClick={handleAdd}>Add Subject</button>

      {/* Subject List */}
      <ul>

        {subjects.map((s) => (
          <li key={s.id}>

            {s.subject_name}
            {" "}
            (Semester: {s.semester_name})

            <button
              onClick={() => handleDelete(s.id)}
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

export default SubjectManager;

