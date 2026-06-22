const Review = require('../Models/ReviewModel');

// ✅ Add Review
exports.addReview = async (req, res) => {
  try {
    const { productId, user, email, comment, rating } = req.body;

    // ✅ Basic validation
    if (!productId || !user || !email || !comment || !rating) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Check duplicate review (same user + same product)
    const existingReview = await Review.findOne({
      product: productId,
      email: email,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // ✅ Create new review
    const newReview = new Review({
      product: productId,
      user,
      email,
      comment,
      rating,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });

  } catch (error) {
    console.log(error);

    // ✅ Handle duplicate index error (extra safety)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    res.status(500).json({
      message: "Error adding review",
    });
  }
};

// ✅ Get Reviews
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching reviews",
    });
  }
};