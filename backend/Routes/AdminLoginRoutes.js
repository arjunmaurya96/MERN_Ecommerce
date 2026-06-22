const { adminLogin, addAdmin, adminForgetPassword, adminResetPassword } = require("../Controllers/AdminLoginController");

const router = require("express").Router();

router.post('/login-admin', adminLogin)
router.post('/register', addAdmin)
router.post("/forget-password", adminForgetPassword);
router.post("/reset-password/:token", adminResetPassword);



module.exports = router;
