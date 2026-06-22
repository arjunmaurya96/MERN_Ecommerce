import React, { useEffect, useState } from "react";
import HeroNavbar from "./HeroNavbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import ReletedProduct from "./ReletedProduct";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const ProductDetails = () => {
  const BASE_URL = "http://localhost:8080";
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();
  const { slug } = useParams();
  
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    user: "",
    email: "",
    comment: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Add to Cart Handler
  const handleAddToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some(
      (cartItem) => cartItem.product._id === item._id
    );

    if (alreadyInCart) {
      toast.error("Already added to cart. Update quantity from cart page");
      return;
    }

    try {
      await addToCart(item, 1);
      toast.success("Product added to cart 🛒");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  // ✅ FIXED: Image URL Handler
  const getImageUrl = (img) => {
    if (!img) return "/img/no-image.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  };

  // ✅ FIXED: Get Product by Slug
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/product/get-product/${slug}`
      );
      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Get Reviews
  const getReviews = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/review/${product._id}`
      );
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  // ✅ FIXED: Review Form Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  // ✅ FIXED: Submit Review
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/review/add`, {
        ...reviewForm,
        productId: product._id,
      });

      toast.success("Review added successfully!");
      
      // Reset form
      setReviewForm({
        user: "",
        email: "",
        comment: "",
        rating: 5,
      });

      // Refresh reviews
      getReviews();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add review"
      );
    }
  };

  // ✅ FIXED: useEffect Dependencies
  useEffect(() => {
    if (slug) {
      getProduct();
    }
  }, [slug]);

  useEffect(() => {
    if (product?._id) {
      getReviews();
    }
  }, [product?._id]);

  // ✅ FIXED: Loading State
  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h4>Product not found</h4>
            <Link to="/" className="btn btn-primary mt-3">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroNavbar />
      {/* <Toaster position="top-right" /> */}

      {/* ================= PAGE HEADER ================= */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">
          {product.name}
        </h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/shop">Shop</Link>
          </li>
          <li className="breadcrumb-item active text-white">
            {product.name}
          </li>
        </ol>
      </div>

      {/* ================= MAIN SECTION ================= */}
      <div className="container-fluid shop py-5">
        <div className="container py-5">
          <div className="row g-4">
            {/* ================= LEFT SIDEBAR ================= */}
            <div className="col-lg-4 col-xl-3">
              <div className="bg-light rounded p-4 shadow-sm">
                <h5 className="fw-bold mb-4 text-center">Why Shop With Us</h5>
                <div className="d-flex align-items-start mb-3">
                  <i className="fa fa-truck fa-lg text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Fast Delivery</h6>
                    <small className="text-muted">
                      Delivery within 2–4 working days.
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="fa fa-undo fa-lg text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Easy Returns</h6>
                    <small className="text-muted">
                      7 days hassle-free returns.
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="fa fa-shield-alt fa-lg text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">Secure Payments</h6>
                    <small className="text-muted">
                      100% secure checkout.
                    </small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="fa fa-headset fa-lg text-primary me-3 mt-1"></i>
                  <div>
                    <h6 className="mb-1">24/7 Support</h6>
                    <small className="text-muted">
                      Always here to help.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="col-lg-8 col-xl-9">
              {/* ================= IMAGE + INFO ================= */}
              <div className="row g-4 align-items-start">
                {/* IMAGE SLIDER */}
                <div className="col-xl-6 col-12">
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    className="single-carousel mb-3"
                  >
                    {product.images?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="single-inner bg-light rounded">
                          <img
                            src={getImageUrl(img)}
                            className="img-fluid rounded w-100"
                            alt={product.name}
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* THUMBNAILS */}
                  {product.images && product.images.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      modules={[Navigation, Thumbs]}
                      spaceBetween={10}
                      slidesPerView={5}
                      watchSlidesProgress
                      breakpoints={{
                        0: { slidesPerView: 3 },
                        768: { slidesPerView: 5 },
                      }}
                    >
                      {product.images.map((img, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={getImageUrl(img)}
                            className="img-fluid rounded border"
                            style={{
                              width: "60px",
                              height: "60px",
                              cursor: "pointer",
                              objectFit: "cover",
                            }}
                            alt="thumb"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>

                {/* PRODUCT INFO */}
                <div className="col-xl-6 col-12">
                  <h4 className="fw-bold mb-3">{product.name}</h4>
                  <p className="mb-2">
                    Category: <strong>{product.category?.name || "N/A"}</strong>
                  </p>

                  <div className="d-flex align-items-center mb-3">
                    <h5 className="fw-bold mb-0 text-primary me-3">
                      ₹{product.discountPrice > 0
                        ? product.discountPrice
                        : product.price}
                    </h5>
                    {product.discountPrice > 0 && (
                      <del className="text-muted">
                        ₹{product.price}
                      </del>
                    )}
                  </div>

                  <div className="d-flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa fa-star ${
                          i < 4 ? "text-warning" : "text-secondary"
                        }`}
                      ></i>
                    ))}
                    <span className="ms-2 text-muted">(4.0)</span>
                  </div>

                  <p className="text-muted">{product.description}</p>

                  {/* ✅ FIXED: Button Click Handler */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary border border-secondary rounded-pill px-4 py-2 mt-3 w-100"
                  >
                    <i className="fa fa-shopping-bag me-2"></i>
                    Add to cart
                  </button>

                  <div className="mt-3">
                    <small className="text-success">
                      <i className="fa fa-check-circle me-1"></i>
                      In Stock: {product.stock || 0} items
                    </small>
                  </div>
                </div>
              </div>

              {/* ================= TABS ================= */}
              <div className="row mt-5">
                <div className="col-12">
                  <ul className="nav nav-tabs mb-4" id="productTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="desc-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#desc"
                        type="button"
                        role="tab"
                      >
                        Description
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="review-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#review"
                        type="button"
                        role="tab"
                      >
                        Reviews ({reviews.length})
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content p-4 border rounded bg-light">
                    <div
                      className="tab-pane fade show active"
                      id="desc"
                      role="tabpanel"
                    >
                      <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>

                    <div className="tab-pane fade" id="review" role="tabpanel">
                      {reviews.length === 0 ? (
                        <p className="text-muted text-center py-4">
                          No reviews yet. Be the first to review this product!
                        </p>
                      ) : (
                        <div className="row">
                          {reviews.map((r, i) => (
                            <div key={r._id || i} className="col-12 mb-4">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="mb-2">{r.user}</h6>
                                    <span className="badge bg-primary">
                                      {r.rating} ⭐
                                    </span>
                                  </div>
                                  <p className="mb-2">{r.comment}</p>
                                  <small className="text-muted">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= REVIEW FORM ================= */}
              <div className="row mt-5">
                <div className="col-12">
                  <h4 className="fw-bold mb-4">Leave a Review</h4>
                  <form onSubmit={submitReview}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="user"
                          value={reviewForm.user}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Your Name *"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="email"
                          name="email"
                          value={reviewForm.email}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Your Email *"
                          required
                        />
                      </div>
                      <div className="col-md-12">
                        <select
                          name="rating"
                          value={reviewForm.rating}
                          onChange={handleChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Rating</option>
                          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                          <option value="3">⭐⭐⭐ (3 Stars)</option>
                          <option value="2">⭐⭐ (2 Stars)</option>
                          <option value="1">⭐ (1 Star)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <textarea
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleChange}
                          className="form-control"
                          rows="5"
                          placeholder="Write your review here..."
                          required
                        />
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-5 py-2"
                          disabled={reviewForm.comment.length < 10}
                        >
                          <i className="fa fa-paper-plane me-2"></i>
                          Post Review
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReletedProduct categoryId={product.category?._id} />
    </>
  );
};

export default ProductDetails;