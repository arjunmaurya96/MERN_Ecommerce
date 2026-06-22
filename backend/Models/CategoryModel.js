const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Category Name (Electronics, Mobiles, etc.)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // SEO Friendly Slug (electronics, mobile-phones)
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // main / sub
    type: {
      type: String,
      enum: ["main", "sub"],
      default: "main",
    },

    // Parent Category (for sub-category)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // Active / Inactive
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Optional description
    description: {
      type: String,
      trim: true,
    },

    // Who created category (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Category", categorySchema);
