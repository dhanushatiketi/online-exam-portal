const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getResult } = require("../controllers/resultcontroller");

router.get("/result/:email", authMiddleware, getResult);

module.exports = router;
