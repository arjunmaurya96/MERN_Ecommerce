// const Order = require("../Models/OrderModel");
const Order = require('../Models/OrderModel')
const PDFDocument = require("pdfkit");

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product",
        select: "name images price", // 👈 image yahin se aa rahi
      })
      .lean();

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    console.error("My Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


exports.getUserOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id, 
    })
      .populate({
        path: "items.product",
        select: "name price images", 
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get User Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};


exports.cancelUserOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ❌ Already cancelled
    if (order.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    // ❌ Shipped / Delivered orders cannot be cancelled
    if (["SHIPPED", "DELIVERED"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // ✅ Cancel order
    order.orderStatus = "CANCELLED";

    // ✅ Push status history
    order.statusHistory.push({
      status: "CANCELLED",
      date: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};


// DELETE CANCELLED ORDER (USER)
exports.deleteUserOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ❌ Only cancelled orders can be deleted
    if (order.orderStatus !== "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};


exports.downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc
      .fontSize(20)
      .text("INVOICE", { align: "center" })
      .moveDown();

    doc
      .fontSize(10)
      .text(`Order ID: ${order._id}`)
      .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .moveDown();

    /* ================= CUSTOMER ================= */
    doc
      .fontSize(12)
      .text("Billing Address", { underline: true })
      .fontSize(10)
      .text(
        `${order.billingAddress.firstName} ${order.billingAddress.lastName}`
      )
      .text(order.billingAddress.address)
      .text(
        `${order.billingAddress.city}, ${order.billingAddress.country} - ${order.billingAddress.zip}`
      )
      .text(`Mobile: ${order.billingAddress.mobile}`)
      .moveDown();

    /* ================= ITEMS TABLE ================= */
    doc.fontSize(12).text("Order Items", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${item.product.name}  |  Qty: ${
            item.qty
          }  |  Price: ₹${item.price}  |  Total: ₹${
            item.qty * item.price
          }`
        );
    });

    doc.moveDown();

    /* ================= TOTAL ================= */
    doc
      .fontSize(10)
      .text(`Subtotal: ₹${order.subtotal}`)
      .text(`Shipping: ₹${order.shippingCharge}`)
      .fontSize(12)
      .text(`Total Amount: ₹${order.totalAmount}`, {
        underline: true,
      });

    doc.moveDown();

    /* ================= FOOTER ================= */
    doc
      .fontSize(10)
      .text("Thank you for shopping with us!", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
    });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    // ✅ Get all orders of logged-in user
    const orders = await Order.find({ user: req.user.id });

    // ✅ Stats calculation
    const totalOrders = orders.length;

    const cancelledOrders = orders.filter(
      order => order.orderStatus === "CANCELLED"
    ).length;

    const activeOrders = orders.filter(order =>
      ["PENDING", "PROCESSING", "SHIPPED", "PLACED"].includes(order.orderStatus)
    ).length;

    // ✅ Send clean response
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name || "",   
        email: req.user.email,
        role: req.user.role,
      },
      stats: {
        totalOrders,
        activeOrders,
        cancelledOrders,
      },
    });

  } catch (error) {
    console.error("User Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};