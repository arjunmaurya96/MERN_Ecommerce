const { placeOrder, getOrderById } = require("../Controllers/OrderController");
const auth = require("../Middleware/AuthMiddleware")


const router = require("express").Router();

router.post("/order-place" ,  auth, placeOrder)
router.get("/get/:orderId", auth, getOrderById);

module.exports = router;