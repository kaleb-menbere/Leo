// routes/dish.js
const express = require("express");
const router = express.Router();
const { createDish, getAllDishes } = require("../controllers/dishController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createDish); // only logged-in users (restaurants)
router.get("/", getAllDishes); // open to everyone

module.exports = router;
