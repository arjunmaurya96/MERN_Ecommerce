const { registerUser, loginUser, forgetPassword, resetPassword, googleLogin } = require('../Controllers/UserloginController');
const router = require('express').Router();

router.post("/user-register", registerUser)
router.post("/user-login", loginUser)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)
router.post("/auth/google", googleLogin)



module.exports = router;