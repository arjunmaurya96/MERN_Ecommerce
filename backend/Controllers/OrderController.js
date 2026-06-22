const Order = require("../Models/OrderModel");
const Cart = require("../Models/CartModel");
/* ================= PLACE ORDER ================= */
const placeOrder = async (req, res) => {
  try {
    console.log("🟢 ORDER API HIT");

    const userId = req.user.id;
    const { billingAddress, paymentMethod = "COD" } = req.body;

    // 🔹 Validate billing details
    if (!billingAddress || !billingAddress.address || !billingAddress.mobile) {
      return res.status(400).json({
        success: false,
        message: "Billing details required",
      });
    }

    // 🔹 Validate payment method
    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // 🔹 Get user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 🔹 Calculate subtotal & prepare items
    let subtotal = 0;
    const items = cart.items.map((i) => {
      subtotal += i.price * i.qty;
      return {
        product: i.product,
        qty: i.qty,
        price: i.price,
      };
    });

    const SHIPPING_CHARGE = 3;

    // 🔹 Create order with status history
    const order = await Order.create({
      user: userId,
      items,
      billingAddress,
      paymentMethod,
      subtotal,
      shippingCharge: SHIPPING_CHARGE,
      totalAmount: subtotal + SHIPPING_CHARGE,
      paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
      orderStatus: "PLACED",

      // ✅ NEW: Tracking history
      statusHistory: [
        {
          status: "PLACED",
        },
      ],
    });

    // 🔹 Clear cart after order
    cart.items = [];
    await cart.save();

    console.log("🟢 ORDER CREATED:", order._id);

    // 🔹 Success response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("❌ ORDER API ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
    });
  }
};

/* ================= GET SINGLE ORDER ================= */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

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

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};



module.exports = {
  placeOrder,
  getOrderById,
};
