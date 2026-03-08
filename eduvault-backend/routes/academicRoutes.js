
const express = require("express");
const router = express.Router();
const { getAcademicTree } = require("../controllers/academicController");

router.get("/academic-tree", getAcademicTree);

module.exports = router;