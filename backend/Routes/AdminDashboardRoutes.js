const router = require('express').Router();

const { getDashboardStats } = require('../Controllers/AdminDashboardController');
const AdminAuth = require("../Middleware/AdminAuthMiddleware")
router.get("/dashboard", AdminAuth, getDashboardStats);

module.exports = router;