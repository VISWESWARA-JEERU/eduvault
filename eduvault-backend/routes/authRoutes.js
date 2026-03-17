
const express = require("express"); 
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, isAdmin, isSuperAdmin } = require("../middleware/authMiddleware");

router.post("/login", authController.login);

// Public user registration
router.post("/register", authController.register);

// Forgot / reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

// Only SuperAdmin can create admin accounts
router.post(
  "/register-admin",
  verifyToken,
  isSuperAdmin,
  authController.registerAdmin
);

// Admins and SuperAdmin can fetch users
router.get("/users", verifyToken, isAdmin, authController.getUsers);

// Delete user (Admin and SuperAdmin can delete users)
router.delete("/users/:id", verifyToken, isAdmin, authController.deleteUser);

// Delete admin (Only SuperAdmin can delete admins)
router.delete("/admins/:id", verifyToken, isSuperAdmin, authController.deleteAdmin);

module.exports = router;