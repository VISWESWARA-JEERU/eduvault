
const express = require("express");
const router = express.Router();
const { addBranch, getBranches, deleteBranch } = require("../controllers/branchController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Get branches (any logged in user)
router.get("/", verifyToken, getBranches);

// Add branch (Admin only)
router.post("/", verifyToken, isAdmin, addBranch);

// Delete branch (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteBranch);

module.exports = router;