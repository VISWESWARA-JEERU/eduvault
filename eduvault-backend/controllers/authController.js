const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");


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
