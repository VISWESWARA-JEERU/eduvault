require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    } else {
        console.log("MySQL Connected ✅");
    }
});

// Delete all users except id=1 (New Admin)
db.query("DELETE FROM users WHERE id != 1", (err, result) => {
    if (err) {
        console.error("Error deleting users:", err);
        db.end();
        process.exit(1);
    }
    console.log(`✅ Deleted ${result.affectedRows} users`);

    // Show remaining users
    db.query("SELECT id, name, email, role FROM users", (err, users) => {
        if (err) {
            console.error("Error fetching users:", err);
            db.end();
            process.exit(1);
        }
        console.log("\n📋 Remaining users:");
        console.table(users);
        db.end();
        console.log("\n✅ Cleanup complete!");
    });
});
