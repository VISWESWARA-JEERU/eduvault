
import { useEffect, useState } from "react";
import API from "../../api/axios";

function SemesterManager() {

  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [semesterName, setSemesterName] = useState("");
  const [yearId, setYearId] = useState("");

  // Fetch semesters + years
  const fetchData = async () => {
    try {
      const sem = await API.get("/semesters");
      const yr = await API.get("/years");
       console.log(sem.data);
      setSemesters(sem.data);
       console.log(yr.data);
      setYears(yr.data);
     

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add semester
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
        year_id: Number(yearId)
      });

      setSemesterName("");
      setYearId("");
      fetchData();

    } catch (err) {
      console.error("Error adding semester:", err);
      alert("Failed to add semester ❌");
    }
  };

  // Delete semester
  const handleDelete = async (id) => {
    try {
      await API.delete(`/semesters/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting semester:", err);
    }
  };

  return (
    <div>

      <h3>Semester Manager</h3>

      {/* Semester Input */}
      <input
        type="text"
        placeholder="Semester Name"
        value={semesterName}
        onChange={(e) => setSemesterName(e.target.value)}
      />

      {/* Year Dropdown */}
      <select
        value={yearId}
        onChange={(e) => setYearId(e.target.value)}
      >

        <option value="">Select Year</option>

        {years.map((year) => (
          <option key={year.id} value={year.id}>
            {year.year_name} ({year.branch_name})
          </option>
        ))}

      </select>

      <button onClick={handleAdd}>Add Semester</button>

      {/* Semester List */}
      <ul>

        {semesters.map((semester) => (
          <li key={semester.id}>

            {semester.semester_name}
            {" "}
            (Year: {semester.year_name} - {semester.branch_name})

            <button
              onClick={() => handleDelete(semester.id)}
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

export default SemesterManager;