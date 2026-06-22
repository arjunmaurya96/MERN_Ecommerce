// const express = require("express");
// const router = express.Router();

const { addToCart, getCart, updateCartQty, removeFromCart, clearCart } = require("../Controllers/CartController");
// const auth = require('../Middleware/AdminAuthMiddleware')
const auth = require('../Middleware/AuthMiddleware')


const router = require("express").Router();

router.post('/add-two-cart', auth, addToCart)
router.get('/get-cart', auth, getCart)
router.put("/update-cart-qty", auth, updateCartQty)
router.delete("/remove-from-cart/:productId", auth, removeFromCart)
router.delete("/clear-cart", auth, clearCart)





module.exports = router;
