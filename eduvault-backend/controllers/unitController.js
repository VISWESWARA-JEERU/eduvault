
const db = require("../config/db");

/*
========================================
✅ Get All Units (with Subject Name)
========================================
*/
exports.getAllUnits = (req, res) => {

    const sql = `
        SELECT 
            units.id,
            units.unit_name,
            subjects.subject_name
        FROM units
        JOIN subjects ON units.subject_id = subjects.id
        ORDER BY units.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Error fetching units:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });

};


/*
========================================
✅ Get Units By Subject Name
========================================
*/
exports.getUnitsBySubject = (req, res) => {

    const { subject_id } = req.params;

    if (!subject_id) {
        return res.status(400).json({ message: "Subject ID is required ❌" });
    }

    const sql = `
        SELECT id, unit_name
        FROM units
        WHERE subject_id = ?
        ORDER BY id
    `;

    db.query(sql, [subject_id], (err, result) => {

        if (err) {
            console.error("Error fetching units:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });

};


/*
========================================
✅ Add New Unit
========================================
*/
exports.addUnit = (req, res) => {

    const { unit_name, subject_id } = req.body;

    if (!unit_name || !subject_id) {
        return res.status(400).json({
            message: "Unit name and subject ID required ❌"
        });
    }

    const sql = `
        INSERT INTO units (unit_name, subject_id)
        VALUES (?, ?)
    `;

    db.query(sql, [unit_name, subject_id], (err, result) => {

        if (err) {
            console.error("Add Unit Error:", err);
            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "Unit added successfully ✅",
            unit_id: result.insertId
        });

    });

};


/*
========================================
✅ Delete Unit
========================================
*/
exports.deleteUnit = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Unit ID is required ❌" });
    }

    const sql = "DELETE FROM units WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Error deleting unit:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Unit not found ❌" });
        }

        res.status(200).json({
            message: "Unit deleted successfully 🗑️"
        });

    });

};