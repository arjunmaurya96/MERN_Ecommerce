const express = require("express");
const router = express.Router();

// const {
//   getUserProfile,
//   updateUserProfile,
//   changeUserPassword,
// } = require("../controllers/userProfileController");

// const authMiddleware = require("../middlewares/authMiddleware");
const authMiddleware = require("../Middleware/AuthMiddleware");
const { getUserProfile, updateUserProfile, changeUserPassword } = require("../Controllers/UserProfileController");

/* ================= PROFILE ROUTES ================= */
router.get("/get-profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateUserProfile);
router.put("/update-password", authMiddleware, changeUserPassword);

module.exports = router;
