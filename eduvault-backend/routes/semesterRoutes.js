
const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/semesterController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 📌 Get all semesters
router.get("/", semesterController.getAllSemesters);

// 📌 Get semesters by year
router.get("/year/:year_id", semesterController.getSemestersByYear);

// 🔐 Admin only - Add semester
router.post("/", verifyToken, isAdmin, semesterController.addSemester);

// 🔐 Admin only - Delete semester
router.delete("/:id", verifyToken, isAdmin, semesterController.deleteSemester);

module.exports = router;