const express = require("express");
const router = express.Router();

const adminAuth = require("../Middleware/AdminAuthMiddleware");

const {
  getAllUsers,
  getUserDetails,
  toggleBlockUser,
  getUserOrders,
} = require("../Controllers/AdminUserController");

/* ALL USERS */
router.get("/all-user", adminAuth, getAllUsers);

/* USER DETAILS */
router.get("/:id", adminAuth, getUserDetails);

/* BLOCK / UNBLOCK */
router.put("/block-user/:id", adminAuth, toggleBlockUser);

/* USER ORDERS */
router.get("/user-orders/:id", adminAuth, getUserOrders);

module.exports = router;