const Order = require('../Models/OrderModel')
const User = require('../Models/Userlogin')

exports.getDashboardStats = async (req, res) => {
  try {
    //  Admin auth already middleware me hona chahiye

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /* ================= COUNTS ================= */
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ["PLACED", "CONFIRMED"] },
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "DELIVERED",
    });

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    /* ================= REVENUE ================= */
    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "DELIVERED" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          orderStatus: "DELIVERED",
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    /* ================= LATEST ORDERS ================= */
    const latestOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("user totalAmount orderStatus createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        todayOrders,
        todayRevenue,
        totalRevenue,
      },
      latestOrders,
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};
