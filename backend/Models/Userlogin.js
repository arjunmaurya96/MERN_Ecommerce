// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: { type: String, required: true },

//     mobile: { type: String }, 

//     role: { type: String, default: "user" },

//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("userlogin", userSchema);

















// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema({
// //     name: { type: String },
// //     email: { type: String },
// //     password: { type: String },
// //     role: { type: String, default: "user" },
// //     resetPasswordToken: {
// //         type: String
// //     },
// //     resetPasswordExpire: {
// //         type: Date
// //     }

// // }, { timestamps: true })

// // const user = new mongoose.model("userlogin", userSchema);
// // module.exports = user;




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String }, // ❗ optional

    mobile: { type: String },

    role: { type: String, default: "user" },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 🔥 ADD THIS (important for Google users)
    googleId: {
      type: String,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("userlogin", userSchema);