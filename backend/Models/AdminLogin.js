const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "admin"
    },

    // 🔐 FOR RESET PASSWORD
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("adminUser", adminUserSchema);
