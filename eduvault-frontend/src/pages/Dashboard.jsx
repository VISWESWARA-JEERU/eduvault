
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import DrawerMenu from "../components/DrawerMenu";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Student";
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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalPdfs = pdfs.length;

  const branchRef = useRef(null);
  const yearRef = useRef(null);
  const semesterRef = useRef(null);
  const subjectRef = useRef(null);
  const unitRef = useRef(null);
  const pdfRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const currentContextLabel = [
    selectedBranch &&
      branches.find((b) => String(b.id) === String(selectedBranch))?.branch_name,
    selectedYear &&
      years.find((y) => String(y.id) === String(selectedYear))?.year_name,
    selectedSemester &&
      semesters.find((s) => String(s.id) === String(selectedSemester))
        ?.semester_name,
    selectedSubject &&
      subjects.find((s) => String(s.id) === String(selectedSubject))
        ?.subject_name,
    selectedUnit &&
      units.find((u) => String(u.id) === String(selectedUnit))?.unit_name,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="dashboard-page">
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Navigation"
        items={[
          { label: "Branch", onClick: () => scrollTo(branchRef) },
          { label: "Year", onClick: () => scrollTo(yearRef) },
          { label: "Semester", onClick: () => scrollTo(semesterRef) },
          { label: "Subject", onClick: () => scrollTo(subjectRef) },
          { label: "Unit", onClick: () => scrollTo(unitRef) },
          { label: "PDFs", onClick: () => scrollTo(pdfRef) },
          { label: "Logout", onClick: handleLogout },
        ]}
      />

      <div className="dashboard-shell">
        <div className="dashboard-header">
          <button
            className="hamburger-btn"
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </button>

          <div>
            <h1>📚 EduVault learning space of JNTUA College of Engineering</h1>
            <p>Hi {name}! Select branch → year → semester → subject → unit to explore PDFs.</p>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-stats">
              <div className="stat-card">
                <span className="stat-label">Available PDFs</span>
                <span className="stat-value">{totalPdfs}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Units loaded</span>
                <span className="stat-value">{units.length}</span>
              </div>
            </div>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

<div className="selectors-container" ref={branchRef}>
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
          <div className="selector-group" ref={yearRef}>
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedBranch}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year_name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="selector-group" ref={semesterRef}>
            <label>Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.semester_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="selector-group" ref={subjectRef}>
            <label>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="selector-group" ref={unitRef}>
            <label>Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentContextLabel && (
          <div className="dashboard-context-card" ref={pdfRef}>
            <span className="context-label">Currently viewing</span>
            <span className="context-value">{currentContextLabel}</span>
          </div>
        )}

        {/* PDF LIST */}
        <div className="pdfs-container">
          <h2>📄 PDFs</h2>

          {selectedUnit === "" && (
            <p className="no-pdfs">
              Choose a branch, year, semester, subject, and unit to see PDFs.
            </p>
          )}

          {selectedUnit !== "" && loading && (
            <p className="loading">Loading PDFs...</p>
          )}

          {selectedUnit !== "" && !loading && pdfs.length === 0 && (
            <p className="no-pdfs">No PDFs available for this unit.</p>
          )}

          {selectedUnit !== "" && !loading && pdfs.length > 0 && (
            <div className="pdf-list">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="pdf-card">
                  <div className="pdf-info">
                    <h3>{pdf.title}</h3>
                    <p className="pdf-meta">
                      Downloads: {pdf.download_count || 0}
                    </p>
                  </div>
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
      </div>
    </div>
  );
}

export default Dashboard;