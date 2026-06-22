const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const User = require("../Models/Userlogin")

const authMiddleware = async (req, res, next) => {
  try {
    /* ================= GET TOKEN ================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    /* ================= VERIFY TOKEN ================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    /* ================= GET USER ================= */
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= ATTACH USER ================= */
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
    });
  }
};

module.exports = authMiddleware;
