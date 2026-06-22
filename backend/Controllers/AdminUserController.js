// const User = require("../Models/userModel");
// const Order = require("../Models/orderModel");

const User = require('../Models/Userlogin')
const Order = require('../Models/OrderModel')



/* =========================
   GET ALL USERS
========================= */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

/* =========================
   GET USER DETAILS
========================= */

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not found",
    });
  }
};

/* =========================
   BLOCK / UNBLOCK USER
========================= */

exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Action failed",
    });
  }
};

/* =========================
   GET USER ORDERS
========================= */

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};