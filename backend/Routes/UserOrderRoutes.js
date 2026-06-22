const router = require("express").Router();
const { getMyOrders, getUserOrderById, cancelUserOrder, deleteUserOrder, downloadInvoice, getUserDashboard } = require("../Controllers/UserOrderController");
const userAuth = require('../Middleware/AuthMiddleware')

router.get("/user/my-orders", userAuth, getMyOrders);
router.get("/user/order/:orderId", userAuth, getUserOrderById);
router.put("/user/order/cancel/:orderId", userAuth, cancelUserOrder);
router.delete("/user/order/delete/:orderId", userAuth, deleteUserOrder)
router.get('/user/order/invoice/:orderId', userAuth, downloadInvoice)
router.get('/user/dashboard', userAuth, getUserDashboard)


// router.get(
//   "/dashboard/user/order/invoice/:orderId",
//   requireSignIn,
//   downloadInvoice
// );


// router.delete(
//   "/dashboard/user/order/:orderId",
//   requireSignIn,
//   deleteUserOrder
// );




module.exports = router;