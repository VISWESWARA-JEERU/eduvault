
import { useState, useEffect } from "react";
import API from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load branches
  useEffect(() => {
    fetchBranches();
  }, []);

  // Branch → Years
  useEffect(() => {
    if (selectedBranch) {
      fetchYears(selectedBranch);
      setSelectedYear("");
      setSemesters([]);
      setSubjects([]);
      setUnits([]);
      setPdfs([]);
    }
  }, [selectedBranch]);

  // Year → Semesters
  useEffect(() => {
    if (selectedYear) {
      fetchSemesters(selectedYear);
      setSelectedSemester("");
      setSubjects([]);
      setUnits([]);
      setPdfs([]);
    }
  }, [selectedYear]);
 


  // Semester → Subjects
  useEffect(() => {
    if (selectedSemester) {
      fetchSubjects(selectedSemester);
      setSelectedSubject("");
      setUnits([]);
      setPdfs([]);
    }
  }, [selectedSemester]);
  

  // Subject → Units
  useEffect(() => {
    if (selectedSubject) {
      fetchUnits(selectedSubject);
      setSelectedUnit("");
      setPdfs([]);
    }
  }, [selectedSubject]);

  // Unit → PDFs
  useEffect(() => {
    if (selectedUnit) {
      fetchPdfs(selectedUnit);
    }
  }, [selectedUnit]);

  const fetchBranches = async () => {
    try {
      setError("");
      const res = await API.get("/branches");
      setBranches(res.data);
    } catch (err) {
      setError("Failed to load branches");
      console.error(err);
    }
  };

  const fetchYears = async (branchId) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/years");
      const filtered = res.data.filter((y) => y.branch_id == branchId);

      setYears(filtered);
    } catch (err) {
      setError("Failed to load years");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const fetchSemesters = async (yearId) => {
  try {
    setLoading(true);
    setError("");

    const res = await API.get(`/semesters/year/${yearId}`);

    setSemesters(res.data);

  } catch (err) {
    setError("Failed to load semesters");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchSubjects = async (semesterId) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/subjects/semester/${semesterId}`);
      console.log("subjects API RESPONSE",res.data);

      setSubjects(res.data);
    } catch (err) {
      setError("Failed to load subjects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (subjectId) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/units/subject/${subjectId}`);
 
     console.log("units API RESPONSE",res.data);
      setUnits(res.data);
    } catch (err) {
      setError("Failed to load units");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPdfs = async (unitId) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/pdfs/unit/${unitId}`);
      setPdfs(res.data);
    } catch (err) {
      setError("Failed to load PDFs");
      console.error(err);
      setPdfs([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (pdfId, title) => {
    try {
      const res = await API.get(`/pdfs/download/${pdfId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to download PDF");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📚 EduVault Student Dashboard</h1>
        <p>Select branch → year → semester → subject → unit</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="selectors-container">

        {/* Branch */}
        <div className="selector-group">
          <label>Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.branch_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        {selectedBranch && (
          <div className="selector-group">
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester */}
        {selectedYear && (
          <div className="selector-group">
            <label>Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.semester_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject */}
        {selectedSemester && (
          <div className="selector-group">
            <label>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Unit */}
        {selectedSubject && (
          <div className="selector-group">
            <label>Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unit_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* PDF LIST */}
      {selectedUnit && (
        <div className="pdfs-container">
          <h2>📄 PDFs</h2>

          {loading && <p>Loading PDFs...</p>}

          {!loading && pdfs.length === 0 && (
            <p>No PDFs available for this unit.</p>
          )}

          {!loading && pdfs.length > 0 && (
            <div className="pdf-list">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="pdf-card">
                  <h3>{pdf.title}</h3>

                  <p>Downloads: {pdf.download_count || 0}</p>

                  <button
                    className="download-btn"
                    onClick={() => downloadPdf(pdf.id, pdf.title)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;