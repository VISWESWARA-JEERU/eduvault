
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const yearController = require("../controllers/yearController");

router.get("/", yearController.getYears);
router.get("/branch/:branch_id", yearController.getYearsByBranch);
router.post("/", yearController.addYear);
router.delete("/:id", yearController.deleteYear);

module.exports = router;