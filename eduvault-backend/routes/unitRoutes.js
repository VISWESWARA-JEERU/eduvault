
const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Get all units
router.get("/", verifyToken, unitController.getAllUnits);

// Get units by subject
router.get("/subject/:subject_id", verifyToken, unitController.getUnitsBySubject);

// Add unit (Admin only)
router.post("/", verifyToken, isAdmin, unitController.addUnit);

// Delete unit (Admin only)
router.delete("/:id", verifyToken, isAdmin, unitController.deleteUnit);

module.exports = router;