import { useState, useEffect } from "react";
import API from "../../api/axios";

function PdfManager() {

  const [title, setTitle] = useState("");
  const [unitName, setUnitName] = useState("");
  const [file, setFile] = useState(null);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchUnits = async () => {
      try {
        const res = await API.get("/units");
        setUnits(res.data);
      } catch (err) {
        console.error("Error fetching units:", err);
        setError("Failed to load units ❌");
      }
    };

    fetchUnits();

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
          "Content-Type": "multipart/form-data"
        }
      });

      alert("PDF Uploaded Successfully ✅");

      setTitle("");
      setUnitName("");
      setFile(null);

      // Reset file input
      document.getElementById("pdfFile").value = "";

    } catch (err) {

      console.error("Upload error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
        "Failed to upload PDF ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2>Upload PDF</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="PDF Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Unit Dropdown */}
      <select
        value={unitName}
        onChange={(e) => setUnitName(e.target.value)}
      >

        <option value="">Select Unit</option>

        {units.map((u) => (
          <option
            key={u.id}
            value={u.unit_name}
          >
            {u.unit_name} ({u.subject_name})
          </option>
        ))}

      </select>

      {/* File Input */}
      <input
        id="pdfFile"
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadPdf}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

    </div>
  );
}

export default PdfManager;