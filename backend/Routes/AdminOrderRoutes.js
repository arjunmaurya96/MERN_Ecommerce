const express = require("express");
const router = express.Router();

const auth = require("../Middleware/AuthMiddleware");
// const adminAuth = require("../Middleware/AdminMiddleware");
const adminAuth = require('../Middleware/AdminAuthMiddleware')

const {
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  getPendingOrders,
  getDeliveredOrders,
} = require("../Controllers/AdminOrderController");

router.get("/orders",  adminAuth, getAllOrders);
router.get("/orders/:orderId", adminAuth, getOrderByIdAdmin);
router.put("/update-status/:orderId", adminAuth, updateOrderStatus);
router.get("/pending-orders", adminAuth, getPendingOrders);
router.get('/get-delivered', adminAuth, getDeliveredOrders)

// router.get(
//   "/delivered",
//   adminAuth,
//   getDeliveredOrders
// );

module.exports = router;
