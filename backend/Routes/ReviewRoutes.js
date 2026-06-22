const express = require("express");
const { addReview, getReviews } = require("../Controllers/ReviewController");
const router = express.Router();



router.post("/add", addReview);
router.get("/:productId", getReviews);

module.exports = router;