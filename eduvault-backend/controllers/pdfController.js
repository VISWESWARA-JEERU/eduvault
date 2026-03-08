
const db = require("../config/db");

/*
========================================
✅ Get All PDFs (with Unit Name)
========================================
*/
exports.getAllPdfs = (req, res) => {

    const sql = `
        SELECT 
            pdfs.id,
            pdfs.title,
            pdfs.file_path,
            pdfs.download_count,
            pdfs.uploaded_at,
            units.unit_name
        FROM pdfs
        JOIN units ON pdfs.unit_id = units.id
        ORDER BY pdfs.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Error fetching PDFs:", err.message);
            return res.status(500).json({
                message: "Server Error ❌",
                error: err.message
            });
        }

        res.status(200).json(result);
    });

};


/*
========================================
✅ Get PDFs By Unit Name
========================================
*/
exports.getPdfsByUnit = (req, res) => {

    const { unit_id } = req.params;

    if (!unit_id) {
        return res.status(400).json({ message: "Unit ID required ❌" });
    }

    const sql = `
        SELECT id, title, file_path, download_count
        FROM pdfs
        WHERE unit_id = ?
        ORDER BY id
    `;

    db.query(sql, [unit_id], (err, result) => {

        if (err) {
            console.error("Error fetching PDFs:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });
};

/*
========================================
✅ Upload PDF
========================================
*/
exports.uploadPdf = (req, res) => {

    const { title, unit_name } = req.body;

    if (!req.file) {
        return res.status(400).json({
            message: "PDF file is required ❌"
        });
    }

    if (!title || !unit_name) {
        return res.status(400).json({
            message: "Title and unit name required ❌"
        });
    }

    const file_path = req.file.filename;

    // Step 1: find unit_id
    const findUnit = "SELECT id FROM units WHERE unit_name = ?";

    db.query(findUnit, [unit_name], (err, result) => {

        if (err) {
            console.error("Find Unit Error:", err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Unit not found ❌"
            });
        }

        const unit_id = result[0].id;

        // Step 2: insert PDF
        const insertPdf = `
            INSERT INTO pdfs (title, file_path, unit_id)
            VALUES (?, ?, ?)
        `;

        db.query(insertPdf, [title, file_path, unit_id], (err, result) => {

            if (err) {
                console.error("Upload PDF Error:", err);
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "PDF uploaded successfully ✅",
                pdf_id: result.insertId
            });

        });

    });

};


/*
========================================
✅ Delete PDF
========================================
*/
exports.deletePdf = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "PDF ID required ❌" });
    }

    const sql = "DELETE FROM pdfs WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Error deleting PDF:", err);
            return res.status(500).json({
                message: "Server Error ❌"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "PDF not found ❌"
            });
        }

        res.status(200).json({
            message: "PDF deleted successfully 🗑️"
        });

    });

};


/*
========================================
✅ Download PDF (Track Downloads)
========================================
*/
exports.downloadPdf = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "PDF ID required ❌" });
    }

    // Increment download count
    const updateSql = `
        UPDATE pdfs 
        SET download_count = download_count + 1 
        WHERE id = ?
    `;

    db.query(updateSql, [id], (err) => {
        if (err) {
            console.error("Download count update failed:", err.message);
        }
    });

    // Fetch file path
    const selectSql = "SELECT file_path FROM pdfs WHERE id = ?";

    db.query(selectSql, [id], (err, result) => {

        if (err) {
            console.error("Error fetching PDF:", err.message);
            return res.status(500).json({
                message: "Server Error ❌"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "PDF not found ❌"
            });
        }

        const filePath = `./uploads/${result[0].file_path}`;

        res.download(filePath, (err) => {
            if (err) {
                console.error("Download error:", err.message);
            }
        });

    });

};