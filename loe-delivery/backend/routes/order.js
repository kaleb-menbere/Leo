const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");

// 🟢 Customer creates an order
router.post("/", verifyToken, createOrder);

// 🟢 Get orders (Customer → own orders, Restaurant → their orders, Admin → all)
router.get("/", verifyToken, getOrders);

// 🟢 Restaurant updates order status
router.patch("/:id/status", verifyToken, updateOrderStatus);

module.exports = router;
