
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, semesterController.addSemester);
router.delete("/:id", verifyToken, semesterController.deleteSemester);