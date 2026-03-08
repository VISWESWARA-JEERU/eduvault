
exports.login = (req, res) => {
  const { email, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND role = ?",
    [email, role],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = result[0];

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(401).json({ message: "Invalid Password" });

      res.json({
        message: "Login Successful",
        role: user.role,
        name: user.name
      });
    }
  );
};