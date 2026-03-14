const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../config/db");

// Reusable mail transporter (configure via environment variables)
const mailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const register = (req, res) => {
  const { name, email, password } = req.body;

  // Check existing user
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "user"],
        (err2) => {
          if (err2) return res.status(500).json(err2);
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
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login Successful",
        token,
        role: user.role,
        name: user.name
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

      // Generate secure token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in password_reset_tokens table
      const insertSql = `
        INSERT INTO password_reset_tokens (user_id, token, expires_at, used)
        VALUES (?, ?, ?, 0)
      `;

      db.query(insertSql, [user.id, token, expiresAt], async (insertErr) => {
        if (insertErr) {
          console.error("Error saving reset token:", insertErr);
          return res.status(500).json({ message: "Server error ❌" });
        }

        const frontendUrl =
          process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: "EduVault password reset",
          html: `
            <p>Hi ${user.name || "there"},</p>
            <p>You requested to reset your EduVault password.</p>
            <p>Click the link below to choose a new password. This link will expire in 1 hour.</p>
            <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>— EduVault</p>
          `,
        };

        try {
          await mailTransporter.sendMail(mailOptions);
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
✅ Reset Password (using token)
========================================
*/
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required ❌" });
  }

  const findTokenSql = `
    SELECT id, user_id, expires_at, used
    FROM password_reset_tokens
    WHERE token = ?
    LIMIT 1
  `;

  db.query(findTokenSql, [token], async (err, result) => {
    if (err) {
      console.error("Reset token lookup error:", err);
      return res.status(500).json({ message: "Server error ❌" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token ❌" });
    }

    const tokenRow = result[0];
    const now = new Date();

    if (tokenRow.used) {
      return res.status(400).json({ message: "Token already used ❌" });
    }

    if (new Date(tokenRow.expires_at) < now) {
      return res.status(400).json({ message: "Token has expired ❌" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, tokenRow.user_id],
        (updateErr) => {
          if (updateErr) {
            console.error("Password update error:", updateErr);
            return res.status(500).json({ message: "Server error ❌" });
          }

          // Mark token as used
          db.query(
            "UPDATE password_reset_tokens SET used = 1 WHERE id = ?",
            [tokenRow.id],
            (markErr) => {
              if (markErr) {
                console.error("Token mark used error:", markErr);
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
