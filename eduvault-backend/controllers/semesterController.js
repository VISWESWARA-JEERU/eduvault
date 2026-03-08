const db = require("../config/db");

/*
========================================
✅ Get All Semesters (Admin View)
========================================
*/
exports.getAllSemesters = (req, res) => {

    const sql = `
        SELECT 
            semesters.id,
            semesters.semester_name,
            years.year_name,
            branches.branch_name
        FROM semesters
        JOIN years ON semesters.year_id = years.id
        JOIN branches ON years.branch_id = branches.id
        ORDER BY branches.id, years.id, semesters.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Error fetching semesters:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });
};


/*
========================================
✅ Get Semesters By Year (for dropdown)
========================================
*/
exports.getSemestersByYear = (req, res) => {

    const { year_id } = req.params;

    if (!year_id) {
        return res.status(400).json({
            message: "Year ID required ❌"
        });
    }

    const sql = `
        SELECT id, semester_name
        FROM semesters
        WHERE year_id = ?
        ORDER BY id
    `;

    db.query(sql, [year_id], (err, result) => {

        if (err) {
            console.error("Error fetching semesters:", err);
            return res.status(500).json({
                message: "Server Error ❌"
            });
        }

        res.status(200).json(result);
    });
};


/*
========================================
✅ Add New Semester
========================================
*/
exports.addSemester = (req, res) => {

    const { semester_name, year_id } = req.body;

    if (!semester_name || !year_id) {
        return res.status(400).json({
            message: "Semester name and year required ❌"
        });
    }

    const insertQuery =
        "INSERT INTO semesters (semester_name, year_id) VALUES (?, ?)";

    db.query(insertQuery, [semester_name, year_id], (err, result) => {

        if (err) {
            console.error("Add Semester Error:", err);
            return res.status(500).json({
                message: "Server Error ❌"
            });
        }

        res.status(200).json({
            message: "Semester added successfully ✅"
        });
    });

};


/*
========================================
✅ Delete Semester
========================================
*/
exports.deleteSemester = (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Semester ID required ❌"
        });
    }

    const sql = "DELETE FROM semesters WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Delete Semester Error:", err);
            return res.status(500).json({
                message: "Server Error ❌"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Semester not found ❌"
            });
        }

        res.status(200).json({
            message: "Semester deleted successfully 🗑️"
        });
    });

};