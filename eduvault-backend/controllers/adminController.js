const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================= REGISTER ADMIN =================
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0) {
          return res.status(400).json({ message: "Admin already exists ❌" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, "admin"],
          (err) => {
            if (err) return res.status(500).json({ error: err });

            res.status(201).json({
              message: "Admin registered successfully ✅",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= LOGIN ADMIN =================
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length === 0) {
        return res.status(404).json({ message: "Admin not found ❌" });
      }

      const admin = result[0];

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password ❌" });
      }

      // 🔐 CREATE JWT TOKEN
      const token = jwt.sign(
        {
          id: admin.id,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ FINAL RESPONSE
      res.json({
        message: "Login successful ✅",
        token,
        role: admin.role,
      });
    }
  );
};