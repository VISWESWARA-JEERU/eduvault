
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import database (important so MySQL connects on server start)
require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Simple request logger to help debug frontend 404s
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    next();
});

// Routes
const academicRoutes = require("./routes/academicRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const branchRoutes = require("./routes/branchRoutes");
const yearRoutes = require("./routes/yearRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const unitRoutes = require("./routes/unitRoutes");
const pdfRoutes = require("./routes/pdfRoutes"); 
const subjectRoutes = require("./routes/subjectRoutes");   
// Route Middlewares
app.use("/api", academicRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/years", yearRoutes);
app.use("/api/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/pdfs", pdfRoutes);
// Default Route (Optional but Recommended)
app.get("/", (req, res) => {
    res.send("EduVault Backend Running ✅");
});

// 404 Handler (Clean Professional Practice)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found ❌" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
