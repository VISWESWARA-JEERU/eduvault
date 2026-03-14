
const db = require("../config/db");

/*
========================================
✅ Get All Subjects (with Semester, Year, Branch)
========================================
*/
exports.getAllSubjects = (req, res) => {

    const sql = `
        SELECT 
            subjects.id,
            subjects.subject_name,
            semesters.semester_name,
            years.year_name,
            branches.branch_name
        FROM subjects
        JOIN semesters ON subjects.semester_id = semesters.id
        JOIN years ON semesters.year_id = years.id
        JOIN branches ON years.branch_id = branches.id
        ORDER BY branches.id, years.id, semesters.id, subjects.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Error fetching subjects:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });

};


/*
========================================
✅ Get Subjects By Semester Name
========================================
*/
exports.getSubjectsBySemester = (req, res) => {

    const { semester_id } = req.params;

    if (!semester_id) {
        return res.status(400).json({ message: "Semester ID required ❌" });
    }

    const sql = `
        SELECT id, subject_name
        FROM subjects
        WHERE semester_id = ?
        ORDER BY id
    `;

    db.query(sql, [semester_id], (err, result) => {

        if (err) {
            console.error("Error fetching subjects:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        res.status(200).json(result);
    });

};


/*
========================================
✅ Add New Subject
========================================
*/
exports.addSubject = (req, res) => {

    const { subject_name, semester_name } = req.body;

    if (!subject_name || !semester_name) {
        return res.status(400).json({
            message: "Subject name and semester name required ❌"
        });
    }

    // Step 1: find semester_id
    const findSemester = "SELECT id FROM semesters WHERE semester_name = ?";

    db.query(findSemester, [semester_name], (err, result) => {

        if (err) {
            console.error("Find Semester Error:", err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Semester not found ❌" });
        }

        const semester_id = result[0].id;

        // Step 2: insert subject
        const insertSubject = `
            INSERT INTO subjects (subject_name, semester_id)
            VALUES (?, ?)
        `;

        db.query(insertSubject, [subject_name, semester_id], (err, result) => {

            if (err) {
                console.error("Add Subject Error:", err);
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Subject added successfully ✅",
                subject_id: result.insertId
            });

        });

    });

};


/*
========================================
✅ Delete Subject
========================================
*/
exports.deleteSubject = (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM subjects WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Error deleting subject:", err);
            return res.status(500).json({ message: "Server Error ❌" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Subject not found ❌" });
        }

        res.status(200).json({
            message: "Subject deleted successfully 🗑️"
        });

    });

};