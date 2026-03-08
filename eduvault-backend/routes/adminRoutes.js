
const express = require("express");
const router = express.Router();

const { loginAdmin, registerAdmin } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

// Protected Admin Dashboard
router.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to Admin Dashboard ✅",
        admin: req.admin
    });
});

module.exports = router;