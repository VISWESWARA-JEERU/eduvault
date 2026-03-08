const db = require("../config/db");

// Add Branch
const addBranch = (req, res) => {
    const { branch_name } = req.body;

    if (!branch_name) {
        return res.status(400).json({ message: "Branch name required ❌" });
    }

    const sql = "INSERT INTO branches (branch_name) VALUES (?)";

    db.query(sql, [branch_name], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Branch added successfully ✅" });
        
    });
};

// Get All Branches
const getBranches = (req, res) => {
    db.query("SELECT * FROM branches", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// ✅ ADD THIS FUNCTION
const deleteBranch = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM branches WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Branch not found ❌" });
        }

        res.json({ message: "Branch deleted successfully ✅" });
    });
};

module.exports = { addBranch, getBranches, deleteBranch };