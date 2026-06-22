const express = require("express");
const router = express.Router();

const upload = require("../Middleware/UploadMiddleware");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getNewArrivals,
  getFeaturedProducts,
  getTopSellingProducts,
  getProductBySlug,
  getRelatedProducts,
} = require("../Controllers/ProductController");

router.post(
  "/add-product",
  upload.array("images", 5),
  addProduct
);

router.get("/get-product", getAllProducts);
router.delete("/delete-product/:id", deleteProduct);

router.put(
  "/update-product/:id",
  upload.array("images", 5),
  updateProduct
);


router.get("/products/new-arrivals", getNewArrivals);
router.get('/get-feature-product', getFeaturedProducts )
router.get("/top-selling", getTopSellingProducts)
router.get("/get-product/:slug", getProductBySlug);
router.get("/related/:slug", getRelatedProducts);



module.exports = router;
