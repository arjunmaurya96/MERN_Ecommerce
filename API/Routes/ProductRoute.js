const express = require("express");
const { addProduct, getProducts, getProductById, updateProductById, deleteProductById } = require("../Controllers/ProductController");

const router = require('express').Router();

// add product 
router.post('/add',addProduct )

// get product 
router.get('/all', getProducts)

// get product by id 
router.get('/:id', getProductById)

//update product by id 
router.put('/:id', updateProductById)

// delete product by id 
router.delete("/:id", deleteProductById)


module.exports = router;