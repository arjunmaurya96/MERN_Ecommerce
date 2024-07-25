const express = require("express");
const { addtoCart, userCart, removeProductFromCart, clearCart, decreaseProuductQty } = require("../Controllers/CartController");
const Authenticated = require("../Middlewares/Auth")
const router = require("express").Router();


// add to Cart 
router.post('/add',Authenticated, addtoCart)

//get user cart 
router.get("/user", Authenticated, userCart)

// remove product from cart 
router.delete("/remove/:prodductId", Authenticated, removeProductFromCart)

// clear cart
router.delete("/clear" , Authenticated, clearCart)

// decrease item qty 
router.post("/--qty", Authenticated, decreaseProuductQty)

module.exports = router;