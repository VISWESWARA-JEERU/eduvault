
const db = require("../config/db");

/*
========================================
✅ Add Year
========================================
*/
const addYear = (req, res) => {

    const { year_name, branch_name } = req.body;

    if (!year_name || !branch_name) {
        return res.status(400).json({
            message: "Year name and branch name required ❌"
        });
    }

    // Get branch_id using branch_name
    const findBranch = "SELECT id FROM branches WHERE branch_name = ?";

    db.query(findBranch, [branch_name], (err, result) => {

        if (err) {
            console.error("Find Branch Error:", err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Branch not found ❌"
            });
        }

        const branch_id = result[0].id;

        const insertYear =
            "INSERT INTO years (year_name, branch_id) VALUES (?, ?)";

        db.query(insertYear, [year_name, branch_id], (err) => {

            if (err) {
                console.error("Add Year Error:", err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Year added successfully ✅"
            });
        });
    });
};


/*
========================================
✅ Get All Years
========================================
*/
const getYears = (req, res) => {

    const sql = `
        SELECT 
            years.id,
            years.year_name,
            branches.branch_name,
            branches.id AS branch_id
        FROM years
        JOIN branches ON years.branch_id = branches.id
        ORDER BY branches.id, years.id
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Fetch Years Error:", err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
};


/*
========================================
✅ Get Years By Branch
========================================
*/
const getYearsByBranch = (req, res) => {

    const { branch_id } = req.params;

    if (!branch_id) {
        return res.status(400).json({
            message: "Branch ID required ❌"
        });
    }

    const sql = `
        SELECT id, year_name
        FROM years
        WHERE branch_id = ?
        ORDER BY id
    `;

    db.query(sql, [branch_id], (err, result) => {

        if (err) {
            console.error("Fetch Years By Branch Error:", err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
};


/*
========================================
✅ Delete Year
========================================
*/
const deleteYear = (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM years WHERE id = ?", [id], (err) => {

        if (err) {
            console.error("Delete Year Error:", err);
            return res.status(500).json(err);
        }

        res.json({
            message: "Year deleted successfully ✅"
        });
    });
};


module.exports = {
    addYear,
    getYears,
    getYearsByBranch,
    deleteYear
};