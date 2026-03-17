const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../config/db");

// Reusable mail transporter (configure via environment variables)
let mailTransporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  mailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}


const register = (req, res) => {
  const { name, email, password } = req.body;

  console.log(`Register attempt: ${name} - ${email}`);

  // Check existing user
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      console.log(`Register attempt: User already exists for ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "user"],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          console.log(`Register attempt: Success for ${email}`);
          res.status(201).json({ message: "User registered successfully ✅" });
        }
      );
    } catch (hashErr) {
      res.status(500).json(hashErr);
    }
  });
};

// Export register so routes can use it
exports.register = register;

// GET users (admin only)
exports.getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};











// LOGIN CONTROLLER
exports.login = (req, res) => {
  const { email, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        console.log(`Login attempt: User not found for email: ${email}`);
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];
      console.log(`Login attempt: Found user ${user.email} with role ${user.role}`);

      // Check if the selected role matches the user's role
      if (user.role !== role) {
        console.log(`Login attempt: Role mismatch for ${email}. Selected: ${role}, DB: ${user.role}`);
        return res.status(401).json({ message: "Invalid role for this account" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        console.log(`Login attempt: Invalid password for ${email}`);
        return res.status(401).json({ message: "Invalid Password" });
      }

      console.log(`Login attempt: Success for ${email}`);
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login Successful",
        token,
        role: user.role,
        name: user.name,
        id: user.id
      });
    }
  );
};

// ✅ REGISTER ADMIN CONTROLLER (ADD THIS)
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
          message: "Admin registered successfully ✅"
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

/*
========================================
✅ Forgot Password (send reset link)
========================================
*/
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required ❌" });
  }

  // Find user by email
  db.query("SELECT id, name, email FROM users WHERE email = ?", [email],
    async (err, result) => {
      if (err) {
        console.error("Forgot password lookup error:", err);
        return res.status(500).json({ message: "Server error ❌" });
      }

      // Always respond success message, even if user not found (for security)
      if (result.length === 0) {
        return res.status(200).json({
          message: "If an account exists for this email, a reset link has been sent ✅",
        });
      }

      const user = result[0];

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store OTP in password_reset_tokens table
      const insertSql = `
        INSERT INTO password_reset_tokens (user_id, otp, expires_at, used)
        VALUES (?, ?, ?, 0)
      `;

      db.query(insertSql, [user.id, otp, expiresAt], async (insertErr) => {
        if (insertErr) {
          console.error("Error saving reset OTP:", insertErr);
          return res.status(500).json({ message: "Server error ❌" });
        }

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: "EduVault password reset OTP",
          html: `
            <p>Hi ${user.name || "there"},</p>
            <p>You requested to reset your EduVault password.</p>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>— EduVault</p>
          `,
        };

        try {
          // Check if email credentials are configured
          if (!mailTransporter) {
            console.log("Email not configured - skipping reset email send (development mode)");
            // Still return success for security
          } else {
            await mailTransporter.sendMail(mailOptions);
          }
        } catch (mailErr) {
          console.error("Error sending reset email:", mailErr);
          // We still return success to avoid leaking which emails exist
        }

        return res.status(200).json({
          message: "If an account exists for this email, a reset link has been sent ✅",
        });
      });
    }
  );
};

/*
========================================
✅ Verify OTP
========================================
*/
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required ❌" });
  }

  const findOtpSql = `
    SELECT prt.id, prt.expires_at, prt.used, u.email
    FROM password_reset_tokens prt
    JOIN users u ON prt.user_id = u.id
    WHERE u.email = ? AND prt.otp = ? AND prt.used = 0
    LIMIT 1
  `;

  db.query(findOtpSql, [email, otp], (err, result) => {
    if (err) {
      console.error("OTP verification error:", err);
      return res.status(500).json({ message: "Server error ❌" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    const otpRow = result[0];
    const now = new Date();

    if (new Date(otpRow.expires_at) < now) {
      return res.status(400).json({ message: "OTP has expired ❌" });
    }

    // OTP is valid
    res.status(200).json({ message: "OTP verified successfully ✅" });
  });
};

/*
========================================
✅ Reset Password (using OTP)
========================================
*/
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required ❌" });
  }

  const findOtpSql = `
    SELECT prt.id, prt.user_id, prt.expires_at, prt.used
    FROM password_reset_tokens prt
    JOIN users u ON prt.user_id = u.id
    WHERE u.email = ? AND prt.otp = ? AND prt.used = 0
    LIMIT 1
  `;

  db.query(findOtpSql, [email, otp], async (err, result) => {
    if (err) {
      console.error("Reset OTP lookup error:", err);
      return res.status(500).json({ message: "Server error ❌" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    const otpRow = result[0];
    const now = new Date();

    if (otpRow.used) {
      return res.status(400).json({ message: "OTP already used ❌" });
    }

    if (new Date(otpRow.expires_at) < now) {
      return res.status(400).json({ message: "OTP has expired ❌" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, otpRow.user_id],
        (updateErr) => {
          if (updateErr) {
            console.error("Password update error:", updateErr);
            return res.status(500).json({ message: "Server error ❌" });
          }

          // Mark OTP as used
          db.query(
            "UPDATE password_reset_tokens SET used = 1 WHERE id = ?",
            [otpRow.id],
            (markErr) => {
              if (markErr) {
                console.error("OTP mark used error:", markErr);
              }
            }
          );

          return res
            .status(200)
            .json({ message: "Password reset successfully ✅" });
        }
      );
    } catch (hashErr) {
      console.error("Password hash error:", hashErr);
      return res.status(500).json({ message: "Server error ❌" });
    }
  });
};

/*
========================================
✅ Delete User (Admin or SuperAdmin can delete users)
========================================
*/
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  
  // Cannot delete self
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "Cannot delete your own account ❌" });
  }

  // Verify user exists and is a user (not admin)
  db.query("SELECT role FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // Allow deleting users, but restrict some admins based on role
    if (result[0].role === "admin" && req.user.id !== 1) {
      return res.status(403).json({ message: "Only SuperAdmin can delete admin accounts ❌" });
    }

    db.query("DELETE FROM users WHERE id = ?", [id], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting user:", deleteErr);
        return res.status(500).json(deleteErr);
      }
      console.log(`User ${id} deleted by user ${req.user.id}`);
      res.status(200).json({ message: "User deleted successfully ✅" });
    });
  });
};

/*
========================================
✅ Delete Admin (Only SuperAdmin can delete admins)
========================================
*/
exports.deleteAdmin = (req, res) => {
  const { id } = req.params;
  
  // Cannot delete self (SuperAdmin)
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "Cannot delete your own account ❌" });
  }

  db.query("DELETE FROM users WHERE id = ? AND role = 'admin'", [id], (err, result) => {
    if (err) {
      console.error("Error deleting admin:", err);
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found ❌" });
    }

    console.log(`Admin ${id} deleted by SuperAdmin ${req.user.id}`);
    res.status(200).json({ message: "Admin deleted successfully ✅" });
  });
};
