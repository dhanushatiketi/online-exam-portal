const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getQuestions, submitExam } = require("../controllers/examcontroller");

router.get("/questions", authMiddleware, getQuestions);
router.post("/submitExam", authMiddleware, submitExam);

module.exports = router;
