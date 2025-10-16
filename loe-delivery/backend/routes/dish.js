// routes/dish.js
const express = require("express");
const router = express.Router();
const { createDish, getAllDishes, getMyDishes } = require("../controllers/dishController");
const verifyToken = require("../middleware/authMiddleware");

// Create a dish (restaurant only)
router.post("/", verifyToken, createDish);

// Get all dishes (customers + admin)
router.get("/", verifyToken, getAllDishes);

// Get only restaurant's own dishes
router.get("/my", verifyToken, getMyDishes);

module.exports = router;
