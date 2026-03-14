import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./Admin.css";

function PdfManager() {
  const [title, setTitle] = useState("");
  const [unitName, setUnitName] = useState("");
  const [file, setFile] = useState(null);
  const [units, setUnits] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [unitsRes, pdfsRes] = await Promise.all([
        API.get("/units"),
        API.get("/pdfs"),
      ]);
      setUnits(unitsRes.data);
      setPdfs(pdfsRes.data);
    } catch (err) {
      console.error("Error fetching PDF data:", err);
      setError("Failed to load units or PDFs ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadPdf = async () => {
    if (!title.trim()) {
      setError("Enter PDF title ❌");
      return;
    }

    if (!unitName) {
      setError("Select unit ❌");
      return;
    }

    if (!file) {
      setError("Select PDF file ❌");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("unit_name", unitName);
    formData.append("pdf", file);

    try {
      await API.post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("PDF Uploaded Successfully ✅");

      setTitle("");
      setUnitName("");
      setFile(null);

      const inputEl = document.getElementById("pdfFile");
      if (inputEl) {
        inputEl.value = "";
      }

      // Refresh list
      fetchData();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message || "Failed to upload PDF ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-card">
          <h3>PDF manager</h3>
          <p className="admin-section-title">
            Upload and attach PDFs to specific units.
          </p>

          {error && <p className="admin-error-text">{error}</p>}

          <div className="admin-input-row">
            <input
              className="admin-input"
              type="text"
              placeholder="PDF title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="admin-select"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            >
              <option value="">Select unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.unit_name}>
                  {u.unit_name} ({u.subject_name})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-input-row" style={{ marginTop: 10 }}>
            <input
              id="pdfFile"
              className="admin-input"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              className="admin-primary-btn"
              onClick={uploadPdf}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>

          <ul className="admin-list" style={{ marginTop: 18 }}>
            {pdfs.map((p) => (
              <li key={p.id}>
                <div>
                  <div className="admin-pdf-title">{p.title}</div>
                  <div className="admin-pdf-meta">
                    {p.unit_name} • {p.subject_name} • {p.semester_name}
                    {p.branch_name ? ` - ${p.branch_name}` : ""}
                    {p.year_name ? ` (${p.year_name})` : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PdfManager;