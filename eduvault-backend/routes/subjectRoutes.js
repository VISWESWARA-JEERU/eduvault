
const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Get all subjects
router.get("/", verifyToken, subjectController.getAllSubjects);

// Get subjects by semester
router.get("/semester/:semester_id", verifyToken, subjectController.getSubjectsBySemester);

// Add subject (Admin only)
router.post("/", verifyToken, isAdmin, subjectController.addSubject);

// Delete subject (Admin only)
router.delete("/:id", verifyToken, isAdmin, subjectController.deleteSubject);

module.exports = router;