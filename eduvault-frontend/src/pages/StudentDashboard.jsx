import { useState, useEffect } from "react";
import API from "../api/axios";
import "./Dashboard.css";

function StudentDashboard() {
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

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch years when branch is selected
  useEffect(() => {
    if (selectedBranch) {
      fetchYears(selectedBranch);
      setSelectedYear("");
      setSemesters([]);
      setSelectedSemester("");
      setSubjects([]);
      setSelectedSubject("");
      setUnits([]);
      setSelectedUnit("");
      setPdfs([]);
    }
  }, [selectedBranch]);

  // Fetch semesters when year is selected
  useEffect(() => {
    if (selectedYear) {
      fetchSemesters(selectedYear);
      setSelectedSemester("");
      setSubjects([]);
      setSelectedSubject("");
      setUnits([]);
      setSelectedUnit("");
      setPdfs([]);
    }
  }, [selectedYear]);

  // Fetch subjects when semester is selected
  useEffect(() => {
    if (selectedSemester) {
      fetchSubjects(selectedSemester);
      setSelectedSubject("");
      setUnits([]);
      setSelectedUnit("");
      setPdfs([]);
    }
  }, [selectedSemester]);

  // Fetch units when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      fetchUnits(selectedSubject);
      setSelectedUnit("");
      setPdfs([]);
    }
  }, [selectedSubject]);

  // Fetch PDFs when unit is selected
  useEffect(() => {
    if (selectedUnit) {
      fetchPdfs(selectedUnit);
    }
  }, [selectedUnit]);

  const fetchBranches = async () => {
    try {
      setError("");
      const response = await API.get("/branches");
      setBranches(response.data);
    } catch (err) {
      setError("Failed to load branches");
      console.error(err);
    }
  };

  const fetchYears = async (branchId) => {
    try {
      setLoading(true);
      setError("");
      // Get all semesters first
      const semesterResponse = await API.get("/semesters");
      console.log("All semesters:", semesterResponse.data);
      
      // Filter semesters by branch_id to get unique year_ids
      const branchSemesters = semesterResponse.data.filter(
        (s) => s.branch_id == branchId
      );
      console.log("Filtered semesters for branch:", branchSemesters);
      
      // Extract unique year_ids
      const uniqueYearIds = [...new Set(branchSemesters.map(s => s.year_id))];
      console.log("Unique year IDs:", uniqueYearIds);
      
      // Get all years
      const yearsResponse = await API.get("/years");
      console.log("All years:", yearsResponse.data);
      
      // Filter years to only those that belong to this branch
      const filteredYears = yearsResponse.data.filter(
        (y) => uniqueYearIds.includes(y.id)
      );
      console.log("Filtered years:", filteredYears);
      
      setYears(filteredYears);
    } catch (err) {
      setError("Failed to load years");
      console.error("Error fetching years:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (yearId) => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/semesters");
      // Filter semesters by year_id
      const filteredSemesters = response.data.filter(
        (s) => s.year_id == yearId
      );
      setSemesters(filteredSemesters);
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
      const response = await API.get("/subjects");
      // Filter subjects by semester_id
      const filteredSubjects = response.data.filter(
        (s) => s.semester_id == semesterId
      );
      setSubjects(filteredSubjects);
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
      const response = await API.get("/units");
      // Filter units by subject_id
      const filteredUnits = response.data.filter(
        (u) => u.subject_id == subjectId
      );
      setUnits(filteredUnits);
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
      const response = await API.get(`/pdfs/unit/${unitId}`);
      setPdfs(response.data);
    } catch (err) {
      setError("Failed to load PDFs");
      console.error(err);
      setPdfs([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (pdfId, pdfTitle) => {
    try {
      const response = await API.get(`/pdfs/download/${pdfId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', pdfTitle + '.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download PDF');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📚 EduVault Student Dashboard</h1>
        <p>Select your branch, year, semester, subject, and unit to view PDFs</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="selectors-container">
        {/* Branch Selector */}
        <div className="selector-group">
          <label htmlFor="branch">📍 Branch:</label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        {selectedBranch && (
          <div className="selector-group">
            <label htmlFor="year">📅 Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedBranch || years.length === 0}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester Selector */}
        {selectedYear && (
          <div className="selector-group">
            <label htmlFor="semester">📖 Semester:</label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={!selectedYear || semesters.length === 0}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.semester_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject Selector */}
        {selectedSemester && (
          <div className="selector-group">
            <label htmlFor="subject">📚 Subject:</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedSemester || subjects.length === 0}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Unit Selector */}
        {selectedSubject && (
          <div className="selector-group">
            <label htmlFor="unit">🎯 Unit:</label>
            <select
              id="unit"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              disabled={!selectedSubject || units.length === 0}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* PDFs Display */}
      {selectedUnit && (
        <div className="pdfs-container">
          <h2>📄 Available PDFs for {units.find(u => u.id == selectedUnit)?.unit_name}</h2>
          
          {loading && <p className="loading">Loading PDFs...</p>}
          
          {!loading && pdfs.length === 0 && (
            <p className="no-pdfs">No PDFs available for this unit yet.</p>
          )}

          {!loading && pdfs.length > 0 && (
            <div className="pdf-list">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="pdf-card">
                  <div className="pdf-info">
                    <h3>📖 {pdf.title}</h3>
                    <p className="pdf-meta">
                      📥 Downloads: {pdf.download_count || 0}
                    </p>
                  </div>
                  <button
                    className="download-btn"
                    onClick={() => downloadPdf(pdf.id, pdf.title)}
                  >
                    ⬇️ Download
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

export default StudentDashboard;