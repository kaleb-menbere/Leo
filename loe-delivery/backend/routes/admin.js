const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");

// Admin analytics route
router.get("/analytics", verifyToken, getAnalytics);

module.exports = router;
