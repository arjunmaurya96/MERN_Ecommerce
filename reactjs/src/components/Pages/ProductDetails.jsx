import React, { useEffect, useState, useCallback } from "react";
import HeroNavbar from "./HeroNavbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReletedProduct from "./ReletedProduct";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/BaseUrl";
import toast, { Toaster } from "react-hot-toast";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const FALLBACK_IMG = "/img/no-image.png";

const TRUST_ITEMS = [
  { icon: "fa-truck",      title: "Fast Delivery",    desc: "Delivery within 2–4 working days." },
  { icon: "fa-undo",       title: "Easy Returns",     desc: "7 days hassle-free returns."       },
  { icon: "fa-shield-alt", title: "Secure Payments",  desc: "100% secure checkout."             },
  { icon: "fa-headset",    title: "24/7 Support",     desc: "Always here to help."              },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

/**
 * Cloudinary-aware image resolver.
 * Backend stores images as [{ url, public_id }]
 * Also handles legacy string paths.
 */
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMG;
  // Cloudinary object { url, public_id }
  if (typeof img === "object" && img.url) return img.url;
  // Legacy string
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/"))    return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return FALLBACK_IMG;
};

const calcDiscount = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */
const styles = `
  :root {
    --pd-primary:        #FF6B00;
    --pd-primary-dark:   #E05A00;
    --pd-primary-glow:   rgba(255,107,0,0.12);
    --pd-primary-border: rgba(255,107,0,0.25);
    --pd-dark:           #111827;
    --pd-text:           #374151;
    --pd-muted:          #6B7280;
    --pd-border:         #E5E7EB;
    --pd-surface:        #F9FAFB;
    --pd-white:          #FFFFFF;
    --pd-radius:         14px;
    --pd-shadow:         0 4px 24px rgba(0,0,0,0.07);
    --pd-transition:     0.22s cubic-bezier(0.4,0,0.2,1);
  }

  .pd * { box-sizing: border-box; }
  .pd   { font-family: 'Outfit', sans-serif; color: var(--pd-text); }

  /* ── LOADING ── */
  .pd-loading {
    min-height: 60vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; font-family: 'Outfit', sans-serif; color: #6B7280;
  }
  .pd-spinner {
    width: 40px; height: 40px;
    border: 3px solid #F3F4F6;
    border-top-color: var(--pd-primary);
    border-radius: 50%;
    animation: pd-spin 0.8s linear infinite;
  }
  @keyframes pd-spin { to { transform: rotate(360deg); } }

  /* ── BREADCRUMB ── */
  .pd-breadcrumb {
    background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
    padding: 20px 0;
  }
  .pd-breadcrumb-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
  .pd-breadcrumb h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 700;
    color: #fff; margin: 0 0 8px;
  }
  .pd-crumbs {
    display: flex; align-items: center;
    gap: 8px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap;
  }
  .pd-crumbs li {
    font-size: 13px; color: rgba(255,255,255,0.45);
    display: flex; align-items: center; gap: 8px;
  }
  .pd-crumbs li::after { content: '›'; }
  .pd-crumbs li:last-child::after { content: ''; }
  .pd-crumbs a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.15s; }
  .pd-crumbs a:hover { color: var(--pd-primary); }
  .pd-crumbs li:last-child { color: var(--pd-primary); }

  /* ── LAYOUT ── */
  .pd-page   { background: #F3F4F6; padding: 40px 0 60px; }
  .pd-inner  {
    max-width: 1280px; margin: 0 auto; padding: 0 24px;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 28px; align-items: start;
  }

  /* ── SIDEBAR ── */
  .pd-sidebar {
    display: flex; flex-direction: column;
    gap: 16px; position: sticky; top: 20px;
  }
  .pd-sidebar-card {
    background: var(--pd-white);
    border-radius: var(--pd-radius);
    padding: 24px; box-shadow: var(--pd-shadow);
  }
  .pd-sidebar-title {
    font-size: 13px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--pd-dark); margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--pd-border);
    position: relative;
  }
  .pd-sidebar-title::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 32px; height: 2px; background: var(--pd-primary);
  }
  .pd-trust-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 12px 0; border-bottom: 1px solid var(--pd-border);
  }
  .pd-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
  .pd-trust-icon {
    width: 38px; height: 38px; flex-shrink: 0;
    background: var(--pd-primary-glow);
    border: 1px solid var(--pd-primary-border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--pd-primary); font-size: 15px;
  }
  .pd-trust-text h6 { font-size: 13.5px; font-weight: 600; color: var(--pd-dark); margin: 0 0 2px; }
  .pd-trust-text p  { font-size: 12px; color: var(--pd-muted); margin: 0; line-height: 1.4; }

  /* ── MAIN CONTENT ── */
  .pd-content { display: flex; flex-direction: column; gap: 24px; }

  /* ── PRODUCT CARD ── */
  .pd-product-card {
    background: var(--pd-white);
    border-radius: var(--pd-radius);
    box-shadow: var(--pd-shadow);
    padding: 28px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px; align-items: start;
  }

  /* ── IMAGE GALLERY ── */
  .pd-img-main-wrap {
    border-radius: 12px; overflow: hidden;
    background: var(--pd-surface);
    margin-bottom: 12px;
    aspect-ratio: 1 / 1;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-img-main {
    width: 100%; height: 100%;
    object-fit: contain; display: block;
    transition: transform 0.4s ease;
  }
  .pd-img-main-wrap:hover .pd-img-main { transform: scale(1.04); }

  .pd-thumbs {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .pd-thumb-btn {
    width: 64px; height: 64px;
    border-radius: 8px; overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer; padding: 0;
    background: var(--pd-surface);
    transition: border-color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .pd-thumb-btn:hover   { transform: scale(1.05); }
  .pd-thumb-btn.active  { border-color: var(--pd-primary); }
  .pd-thumb-btn img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }

  /* ── PRODUCT INFO ── */
  .pd-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .pd-badge {
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px; letter-spacing: 0.05em;
  }
  .pd-badge-cat      { background: var(--pd-surface); color: var(--pd-muted); border: 1px solid var(--pd-border); }
  .pd-badge-discount { background: rgba(22,163,74,0.1); color: #16A34A; border: 1px solid rgba(22,163,74,0.2); }
  .pd-badge-stock    { background: var(--pd-primary-glow); color: var(--pd-primary); border: 1px solid var(--pd-primary-border); }
  .pd-badge-outstock { background: rgba(220,38,38,0.08); color: #DC2626; border: 1px solid rgba(220,38,38,0.2); }

  .pd-name { font-size: 22px; font-weight: 700; color: var(--pd-dark); line-height: 1.3; margin-bottom: 14px; }
  .pd-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .pd-price { font-size: 28px; font-weight: 700; color: var(--pd-primary); font-variant-numeric: tabular-nums; }
  .pd-price-original { font-size: 16px; color: var(--pd-muted); text-decoration: line-through; }

  .pd-stars { display: flex; align-items: center; gap: 4px; margin-bottom: 16px; }
  .pd-star       { color: #FCD34D; font-size: 14px; }
  .pd-star.empty { color: #D1D5DB; }
  .pd-rating-text { font-size: 13px; color: var(--pd-muted); margin-left: 4px; }

  .pd-desc {
    font-size: 14px; line-height: 1.7; color: var(--pd-muted);
    margin-bottom: 20px; padding-bottom: 20px;
    border-bottom: 1px solid var(--pd-border);
  }
  .pd-stock-row {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; margin-bottom: 16px;
  }
  .pd-stock-row.in-stock  { color: #16A34A; }
  .pd-stock-row.out-stock { color: #DC2626; }

  .pd-btn-cart {
    width: 100%;
    background: var(--pd-primary); border: none; color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700;
    padding: 15px 24px; border-radius: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: var(--pd-transition); letter-spacing: 0.02em; margin-bottom: 12px;
  }
  .pd-btn-cart:hover:not(:disabled) {
    background: var(--pd-primary-dark);
    box-shadow: 0 6px 20px rgba(255,107,0,0.3);
    transform: translateY(-1px);
  }
  .pd-btn-cart:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .pd-btn-cart--incart {
    background: #F3F4F6 !important;
    color: var(--pd-muted) !important;
    box-shadow: none !important;
    border: 1.5px solid var(--pd-border);
  }

  .pd-btn-wishlist {
    width: 100%; background: transparent;
    border: 1.5px solid var(--pd-border);
    color: var(--pd-text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 13px 24px; border-radius: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: var(--pd-transition);
  }
  .pd-btn-wishlist:hover {
    border-color: var(--pd-primary);
    color: var(--pd-primary);
    background: var(--pd-primary-glow);
  }

  /* ── TABS ── */
  .pd-tabs-card {
    background: var(--pd-white);
    border-radius: var(--pd-radius);
    box-shadow: var(--pd-shadow);
    overflow: hidden;
  }
  .pd-tab-nav {
    display: flex;
    border-bottom: 2px solid var(--pd-border);
    background: var(--pd-surface);
    overflow-x: auto;
  }
  .pd-tab-btn {
    background: transparent; border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--pd-muted);
    padding: 16px 28px; cursor: pointer;
    transition: var(--pd-transition);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px; white-space: nowrap;
    flex-shrink: 0;
  }
  .pd-tab-btn:hover { color: var(--pd-primary); }
  .pd-tab-btn.active {
    color: var(--pd-primary);
    border-bottom-color: var(--pd-primary);
    background: var(--pd-white);
  }
  .pd-tab-content { padding: 28px; }
  .pd-tab-content p, .pd-tab-content li { font-size: 14.5px; line-height: 1.75; color: var(--pd-text); }

  /* ── REVIEWS ── */
  .pd-review-empty {
    text-align: center; padding: 40px 0;
    color: var(--pd-muted); font-size: 14px;
  }
  .pd-review-empty i { font-size: 36px; color: var(--pd-border); display: block; margin-bottom: 10px; }
  .pd-review-grid { display: flex; flex-direction: column; gap: 14px; }
  .pd-review-card {
    border: 1px solid var(--pd-border); border-radius: 12px; padding: 18px;
    transition: border-color 0.2s;
  }
  .pd-review-card:hover { border-color: var(--pd-primary-border); }
  .pd-review-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;
  }
  .pd-review-user  { font-size: 14px; font-weight: 700; color: var(--pd-dark); }
  .pd-review-date  { font-size: 11.5px; color: var(--pd-muted); margin-top: 2px; }
  .pd-review-rating {
    background: var(--pd-primary-glow);
    border: 1px solid var(--pd-primary-border);
    color: var(--pd-primary);
    font-size: 12px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    display: flex; align-items: center; gap: 4px;
  }
  .pd-review-comment { font-size: 13.5px; color: var(--pd-text); line-height: 1.6; margin: 0; }

  /* ── REVIEW FORM ── */
  .pd-form-card {
    background: var(--pd-white);
    border-radius: var(--pd-radius);
    box-shadow: var(--pd-shadow); padding: 28px;
  }
  .pd-form-title { font-size: 16px; font-weight: 700; color: var(--pd-dark); margin-bottom: 6px; }
  .pd-form-sub   { font-size: 13px; color: var(--pd-muted); margin-bottom: 24px; }
  .pd-form-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pd-form-full  { grid-column: 1 / -1; }
  .pd-input {
    width: 100%;
    background: var(--pd-surface);
    border: 1.5px solid var(--pd-border);
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; color: var(--pd-dark);
    padding: 12px 16px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pd-input:focus {
    border-color: var(--pd-primary);
    box-shadow: 0 0 0 3px var(--pd-primary-glow);
  }
  .pd-input::placeholder { color: #9CA3AF; }
  .pd-textarea { resize: vertical; min-height: 120px; }

  .pd-star-select { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
  .pd-star-select label { font-size: 13px; font-weight: 600; color: var(--pd-muted); margin-right: 4px; }
  .pd-star-btn {
    background: none; border: none; cursor: pointer;
    font-size: 22px; color: #D1D5DB;
    transition: color 0.15s, transform 0.15s; padding: 2px;
  }
  .pd-star-btn.active { color: #FCD34D; }
  .pd-star-btn:hover  { transform: scale(1.2); }

  .pd-submit-btn {
    background: var(--pd-primary); border: none;
    color: white; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    padding: 13px 32px; border-radius: 10px;
    cursor: pointer; transition: var(--pd-transition);
    display: flex; align-items: center; gap: 8px; margin-top: 8px;
  }
  .pd-submit-btn:hover:not(:disabled) {
    background: var(--pd-primary-dark);
    box-shadow: 0 4px 16px rgba(255,107,0,0.25);
    transform: translateY(-1px);
  }
  .pd-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .pd-inner { grid-template-columns: 220px 1fr; }
  }
  @media (max-width: 900px) {
    .pd-inner { grid-template-columns: 1fr; }
    .pd-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
    .pd-sidebar-card { flex: 1; min-width: 240px; }
    .pd-product-card { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .pd-inner    { padding: 0 16px; }
    .pd-page     { padding: 24px 0 48px; }
    .pd-product-card { padding: 20px; }
    .pd-form-grid    { grid-template-columns: 1fr; }
    .pd-tab-btn  { padding: 13px 18px; font-size: 13px; }
    .pd-name     { font-size: 18px; }
    .pd-price    { font-size: 22px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════ */
const LoadingScreen = () => (
  <>
    <style>{styles}</style>
    <HeroNavbar />
    <div className="pd-loading">
      <div className="pd-spinner" />
      <p>Loading product details…</p>
    </div>
  </>
);

/* ═══════════════════════════════════════════════════════
   NOT FOUND SCREEN
═══════════════════════════════════════════════════════ */
const NotFoundScreen = () => (
  <>
    <style>{styles}</style>
    <HeroNavbar />
    <div className="pd-loading">
      <h4>Product not found</h4>
      <Link
        to="/"
        style={{
          background: "#FF6B00", color: "white",
          padding: "10px 24px", borderRadius: 10, textDecoration: "none",
        }}
      >
        Go to Home
      </Link>
    </div>
  </>
);

/* ═══════════════════════════════════════════════════════
   STAR RATING DISPLAY
═══════════════════════════════════════════════════════ */
const StarDisplay = ({ rating = 4, count = 0 }) => (
  <div className="pd-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <i key={n} className={`fas fa-star pd-star${n > rating ? " empty" : ""}`} />
    ))}
    <span className="pd-rating-text">{rating.toFixed(1)} ({count} reviews)</span>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();
  const { slug } = useParams();

  const [product,      setProduct]      = useState(null);
  const [reviews,      setReviews]      = useState([]);
  const [activeTab,    setActiveTab]    = useState("desc");
  const [activeImg,    setActiveImg]    = useState(0);   // selected thumbnail index
  const [reviewForm,   setReviewForm]   = useState({ user: "", email: "", comment: "", rating: 5 });
  const [loading,      setLoading]      = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);

  /* ── Fetch product ────────────────────────────────────────────────────── */
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/product/get-product/${slug}`);
      if (data.success) {
        setProduct(data.product);
        setActiveImg(0);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
    } catch {
      toast.error("Failed to load product");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  /* ── Fetch reviews ────────────────────────────────────────────────────── */
  const fetchReviews = useCallback(async (productId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/review/${productId}`);
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    }
  }, []);

  useEffect(() => { if (slug) fetchProduct(); }, [slug, fetchProduct]);
  useEffect(() => { if (product?._id) fetchReviews(product._id); }, [product?._id, fetchReviews]);

  /* ── Cart ─────────────────────────────────────────────────────────────── */
  const inCart = product ? cartItems.some((ci) => ci.product._id === product._id) : false;

  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (inCart) {
      toast.error("Already in cart — update quantity from the cart page");
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product, 1);
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }, [isAuthenticated, inCart, addToCart, product, navigate]);

  /* ── Review form ──────────────────────────────────────────────────────── */
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/api/review/add`, {
        ...reviewForm,
        productId: product._id,
      });
      toast.success("Review posted!");
      setReviewForm({ user: "", email: "", comment: "", rating: 5 });
      fetchReviews(product._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Derived values ───────────────────────────────────────────────────── */
  const discount   = product ? calcDiscount(product.price, product.discountPrice) : 0;
  const finalPrice = product?.discountPrice > 0 ? product.discountPrice : product?.price;
  const images     = product?.images || [];

  /* ── Early returns ────────────────────────────────────────────────────── */
  if (loading)   return <LoadingScreen />;
  if (!product)  return <NotFoundScreen />;

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{styles}</style>
      <HeroNavbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* ── Breadcrumb ── */}
      <div className="pd pd-breadcrumb">
        <div className="pd-breadcrumb-inner">
          <h1>{product.name}</h1>
          <ol className="pd-crumbs">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shops">Shop</Link></li>
            <li>{product.name}</li>
          </ol>
        </div>
      </div>

      {/* ── Page ── */}
      <div className="pd pd-page">
        <div className="pd-inner">

          {/* ════════ SIDEBAR ════════ */}
          <aside className="pd-sidebar">
            <div className="pd-sidebar-card">
              <div className="pd-sidebar-title">Why Shop With Us</div>
              {TRUST_ITEMS.map((item) => (
                <div className="pd-trust-item" key={item.title}>
                  <div className="pd-trust-icon">
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <div className="pd-trust-text">
                    <h6>{item.title}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ════════ CONTENT ════════ */}
          <div className="pd-content">

            {/* ── Product card ── */}
            <div className="pd-product-card">

              {/* Image gallery */}
              <div>
                <div className="pd-img-main-wrap">
                  <img
                    className="pd-img-main"
                    src={images.length > 0 ? getImageUrl(images[activeImg]) : FALLBACK_IMG}
                    alt={product.name}
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                </div>

                {images.length > 1 && (
                  <div className="pd-thumbs">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        className={`pd-thumb-btn${activeImg === i ? " active" : ""}`}
                        onClick={() => setActiveImg(i)}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.name} ${i + 1}`}
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                {/* Badges */}
                <div className="pd-badge-row">
                  {product.category?.name && (
                    <span className="pd-badge pd-badge-cat">{product.category.name}</span>
                  )}
                  {discount > 0 && (
                    <span className="pd-badge pd-badge-discount">{discount}% OFF</span>
                  )}
                  <span className={`pd-badge ${product.stock > 0 ? "pd-badge-stock" : "pd-badge-outstock"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <h1 className="pd-name">{product.name}</h1>

                {/* Price */}
                <div className="pd-price-row">
                  <span className="pd-price">₹{finalPrice?.toLocaleString("en-IN")}</span>
                  {product.discountPrice > 0 && (
                    <span className="pd-price-original">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <StarDisplay rating={product.rating || 4} count={reviews.length} />

                <p className="pd-desc">
                  {product.description?.replace(/<[^>]+>/g, "") || "No description available."}
                </p>

                {/* Stock info */}
                <div className={`pd-stock-row${product.stock > 0 ? " in-stock" : " out-stock"}`}>
                  <i className={`fas ${product.stock > 0 ? "fa-check-circle" : "fa-times-circle"}`} />
                  {product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}
                </div>

                {/* Cart button */}
                <button
                  className={`pd-btn-cart${inCart ? " pd-btn-cart--incart" : ""}`}
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0 || inCart}
                >
                  {addingToCart ? (
                    <>
                      <div className="pd-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Adding…
                    </>
                  ) : inCart ? (
                    <><i className="fas fa-check" /> In Cart</>
                  ) : (
                    <><i className="fas fa-shopping-cart" /> Add to Cart</>
                  )}
                </button>

                <button className="pd-btn-wishlist">
                  <i className="far fa-heart" /> Add to Wishlist
                </button>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="pd-tabs-card">
              <div className="pd-tab-nav">
                <button
                  className={`pd-tab-btn${activeTab === "desc" ? " active" : ""}`}
                  onClick={() => setActiveTab("desc")}
                >
                  Description
                </button>
                <button
                  className={`pd-tab-btn${activeTab === "reviews" ? " active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="pd-tab-content">
                {activeTab === "desc" && (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                )}

                {activeTab === "reviews" && (
                  reviews.length === 0 ? (
                    <div className="pd-review-empty">
                      <i className="far fa-comment-dots" />
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="pd-review-grid">
                      {reviews.map((r, i) => (
                        <div className="pd-review-card" key={r._id || i}>
                          <div className="pd-review-header">
                            <div>
                              <div className="pd-review-user">{r.user}</div>
                              <div className="pd-review-date">
                                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </div>
                            </div>
                            <div className="pd-review-rating">
                              <i className="fas fa-star" style={{ fontSize: 10 }} /> {r.rating}
                            </div>
                          </div>
                          <p className="pd-review-comment">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ── Review form ── */}
            <div className="pd-form-card">
              <div className="pd-form-title">Write a Review</div>
              <div className="pd-form-sub">Share your experience with this product</div>

              {/* Star selector */}
              <div className="pd-star-select">
                <label>Your Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`pd-star-btn${star <= reviewForm.rating ? " active" : ""}`}
                    onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <form onSubmit={submitReview}>
                <div className="pd-form-grid">
                  <input
                    type="text" name="user" value={reviewForm.user}
                    onChange={handleReviewChange}
                    className="pd-input" placeholder="Your Name *" required
                  />
                  <input
                    type="email" name="email" value={reviewForm.email}
                    onChange={handleReviewChange}
                    className="pd-input" placeholder="Your Email *" required
                  />
                  <textarea
                    name="comment" value={reviewForm.comment}
                    onChange={handleReviewChange}
                    className="pd-input pd-textarea pd-form-full"
                    placeholder="Write your review here…"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="pd-submit-btn"
                  disabled={submitting || reviewForm.comment.trim().length === 0}
                >
                  {submitting ? (
                    <><div className="pd-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Posting…</>
                  ) : (
                    <><i className="fas fa-paper-plane" /> Post Review</>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <ReletedProduct categoryId={product.category?._id} />
    </>
  );
};

export default ProductDetails;