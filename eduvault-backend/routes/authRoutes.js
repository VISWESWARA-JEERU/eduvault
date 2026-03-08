
const express = require("express"); 
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/login", authController.login);

// Public user registration
router.post("/register", authController.register);

router.post(
  "/register-admin",
  verifyToken,
  isAdmin,
  authController.registerAdmin
);

// Admins can fetch all users
router.get("/users", verifyToken, isAdmin, authController.getUsers);

module.exports = router;