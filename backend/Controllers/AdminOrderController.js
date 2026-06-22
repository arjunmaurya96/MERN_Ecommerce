const Order = require('../Models/OrderModel')

/* ================= GET ALL ORDERS ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
  console.error("GET ALL ORDERS ERROR 👉", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}};

/* ================= GET SINGLE ORDER ================= */
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }
    //🔹 Allowed statuses (same as model)
    const allowedStatuses = [
      "PLACED",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }
    // 🔹 Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Safety checks
    if (order.orderStatus === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be updated",
      });
    }

    if (order.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be updated",
      });
    }

    // 🔹 Update status
    order.orderStatus = orderStatus;
    // ✅ Push status history (NEW)
    order.statusHistory.push({
      status: orderStatus,
      date: new Date(),
    });
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


/* ================= GET PENDING ORDERS ================= */
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: {
        $in: ["PLACED", "CONFIRMED", "SHIPPED"],
      },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (error) {
    // console.error("❌ Pending Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending orders",
    });
  }
};

exports.getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: "DELIVERED",
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Delivered Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivered orders",
    });
  }
};