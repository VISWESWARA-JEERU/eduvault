
const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// File Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get all PDFs
router.get("/", verifyToken, pdfController.getAllPdfs);

// Get PDFs by unit
router.get("/unit/:unit_id", verifyToken, pdfController.getPdfsByUnit);

// Download PDF (Track downloads)
router.get("/download/:id", verifyToken, pdfController.downloadPdf);

// Upload PDF (Admin only)
router.post("/", verifyToken, isAdmin, upload.single("pdf"), pdfController.uploadPdf);

// Delete PDF (Admin only)
router.delete("/:id", verifyToken, isAdmin, pdfController.deletePdf);

module.exports = router;