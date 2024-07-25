const express = require("express");
const { addAddress, getAddress } = require("../Controllers/AddressController");
const Authenticated = require("../Middlewares/Auth")
const router = require("express").Router();


// add address 
router.post('/add',Authenticated, addAddress)

// get address 
router.get("/get", Authenticated ,getAddress)



module.exports = router;