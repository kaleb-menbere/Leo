const express = require("express");
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");

// Customer creates order
router.post("/", verifyToken, createOrder);

// Customer views own orders
router.get("/", verifyToken, getCustomerOrders);

// Restaurant updates order status
router.patch("/:id/status", verifyToken, updateOrderStatus);

module.exports = router;
