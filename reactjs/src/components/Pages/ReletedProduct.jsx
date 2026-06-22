import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../services/BaseUrl";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const FALLBACK_IMG = "/img/no-image.png";

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

/**
 * Cloudinary-aware image resolver.
 * Backend stores images as [{ url, public_id }]
 * Falls back for legacy string paths.
 */
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMG;
  if (typeof img === "object" && img.url) return img.url; // ✅ Cloudinary
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/"))    return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return FALLBACK_IMG;
};

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */
const styles = `
  .rp-section {
    background: #f7f4f0;
    padding: 72px 0 88px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .rp-header {
    text-align: center;
    margin-bottom: 48px;
  }
  .rp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #f28b00;
    margin-bottom: 12px;
  }
  .rp-eyebrow::before,
  .rp-eyebrow::after {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: #f28b00;
    border-radius: 2px;
  }
  .rp-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 700;
    color: #111111;
    letter-spacing: -0.5px;
    margin: 0 0 10px;
    line-height: 1.15;
  }
  .rp-header p {
    font-size: 14px;
    color: #8a8480;
    margin: 0;
  }
  .rp-header-bar {
    width: 44px;
    height: 3px;
    background: #f28b00;
    border-radius: 3px;
    margin: 12px auto 0;
  }

  /* ── CARD ── */
  .rp-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e8e3dc;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.32s cubic-bezier(0.4,0,0.2,1),
                border-color 0.32s;
    height: 100%;
  }
  .rp-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(242,139,0,0.10);
    border-color: rgba(242,139,0,0.30);
  }

  /* Image */
  .rp-img-wrap {
    position: relative;
    overflow: hidden;
    background: #fff8ee;
    aspect-ratio: 4 / 3.2;
  }
  .rp-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .rp-card:hover .rp-img-wrap img { transform: scale(1.07); }

  /* New badge */
  .rp-badge-new {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    background: #f28b00;
    color: #fff;
    pointer-events: none;
  }

  /* Eye overlay */
  .rp-overlay {
    position: absolute;
    inset: 0;
    background: rgba(17,17,17,0.38);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.28s ease;
    z-index: 2;
  }
  .rp-card:hover .rp-overlay { opacity: 1; }
  .rp-eye-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f28b00;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-decoration: none;
    transform: scale(0.8);
    transition: transform 0.28s ease, background 0.2s;
    box-shadow: 0 4px 16px rgba(242,139,0,0.45);
  }
  .rp-card:hover .rp-eye-btn { transform: scale(1); }
  .rp-eye-btn:hover { background: #c97200; color: #fff; text-decoration: none; }

  /* Body */
  .rp-card-body { padding: 16px 18px 0; flex: 1; }
  .rp-category {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #f28b00;
    margin-bottom: 6px;
    display: block;
  }
  .rp-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: #1c1a18;
    text-decoration: none;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 10px;
    transition: color 0.2s;
  }
  .rp-name:hover { color: #f28b00; text-decoration: none; }

  /* Price */
  .rp-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .rp-price-current {
    font-size: 18px;
    font-weight: 700;
    color: #f28b00;
    font-variant-numeric: tabular-nums;
  }
  .rp-price-old {
    font-size: 12px;
    color: #8a8480;
    text-decoration: line-through;
  }

  /* Footer */
  .rp-card-footer {
    border-top: 1px solid #e8e3dc;
    padding: 14px 18px 18px;
  }
  .rp-btn-cart {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    padding: 10px 16px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #f28b00;
    color: #fff;
    box-shadow: 0 4px 14px rgba(242,139,0,0.28);
    transition: all 0.32s cubic-bezier(0.4,0,0.2,1);
  }
  .rp-btn-cart:hover:not(:disabled) {
    background: #c97200;
    box-shadow: 0 6px 22px rgba(242,139,0,0.42);
    transform: scale(1.02);
  }
  .rp-btn-cart:disabled {
    background: #f0ece6;
    color: #8a8480;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  /* ── SWIPER OVERRIDES ── */
  .rp-swiper { padding-bottom: 40px !important; }
  .rp-swiper .swiper-pagination-bullet-active { background: #f28b00 !important; }
  .rp-swiper .swiper-button-next,
  .rp-swiper .swiper-button-prev {
    width: 36px !important;
    height: 36px !important;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    color: #1c1a18 !important;
    top: 42% !important;
  }
  .rp-swiper .swiper-button-next::after,
  .rp-swiper .swiper-button-prev::after { font-size: 12px !important; font-weight: 900; }
  .rp-swiper .swiper-button-disabled { opacity: 0.35 !important; }

  /* ── SKELETON ── */
  .rp-skel {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e8e3dc;
    overflow: hidden;
  }
  .rp-skel-img  { aspect-ratio: 4 / 3.2; }
  .rp-skel-body { padding: 16px 18px; }
  .rp-skel-line { border-radius: 6px; margin-bottom: 10px; }
  .rp-shimmer {
    background: linear-gradient(90deg, #f0ece6 25%, #e6e0d8 50%, #f0ece6 75%);
    background-size: 200% 100%;
    animation: rpShimmer 1.4s infinite;
  }
  @keyframes rpShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 767px) {
    .rp-section { padding: 52px 0 64px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="rp-skel">
    <div className="rp-skel-img rp-shimmer" />
    <div className="rp-skel-body">
      <div className="rp-skel-line rp-shimmer" style={{ height: 9,  width: "40%" }} />
      <div className="rp-skel-line rp-shimmer" style={{ height: 14, width: "85%" }} />
      <div className="rp-skel-line rp-shimmer" style={{ height: 11, width: "50%" }} />
      <div className="rp-skel-line rp-shimmer" style={{ height: 32, width: "100%", marginTop: 16, borderRadius: 50 }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD  (memoised)
═══════════════════════════════════════════════════════ */
const RelatedCard = React.memo(({ item, inCart, adding, onAddToCart }) => {
  const hasDiscount = item.discountPrice > 0 && item.discountPrice < item.price;

  return (
    <div className="rp-card">

      {/* Image */}
      <div className="rp-img-wrap">
        <img
          src={getImageUrl(item.images?.[0])}
          alt={item.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <span className="rp-badge-new">New</span>
        <div className="rp-overlay">
          <Link
            to={`/product-details/${item.slug}`}
            className="rp-eye-btn"
            aria-label={`View ${item.name}`}
          >
            <i className="fa fa-eye" />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="rp-card-body">
        <span className="rp-category">{item.category?.name || "Product"}</span>
        <Link to={`/product-details/${item.slug}`} className="rp-name">
          {item.name}
        </Link>
        <div className="rp-price-row">
          {hasDiscount ? (
            <>
              <span className="rp-price-current">
                ₹{item.discountPrice.toLocaleString("en-IN")}
              </span>
              <span className="rp-price-old">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="rp-price-current">
              ₹{item.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="rp-card-footer">
        <button
          className="rp-btn-cart"
          onClick={onAddToCart}
          disabled={inCart || adding}
          aria-label={inCart ? "Already in cart" : "Add to cart"}
        >
          <i className={`fas ${inCart ? "fa-check" : adding ? "fa-spinner fa-spin" : "fa-shopping-cart"}`} />
          {inCart ? "In Cart" : adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
});
RelatedCard.displayName = "RelatedCard";

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const RelatedProduct = () => {
  const { slug }                        = useParams();
  const navigate                        = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [addingId, setAddingId] = useState(null);

  /* ── Fetch ────────────────────────────────────────────────────────────── */
  const fetchRelated = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/product/related/${slug}`);
      if (data.success) setProducts(data.relatedProducts || []);
    } catch (error) {
      console.error("RelatedProduct fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { if (slug) fetchRelated(); }, [slug, fetchRelated]);

  /* ── Cart ─────────────────────────────────────────────────────────────── */
  const isInCart = useCallback(
    (id) => cartItems.some((ci) => (ci.product?._id || ci.product) === id),
    [cartItems]
  );

  const handleAddToCart = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }
      if (isInCart(product._id)) {
        toast.error("Already in cart — update quantity from the cart page");
        return;
      }
      try {
        setAddingId(product._id);
        await addToCart(product, 1);
        toast.success("Added to cart 🛒");
      } catch {
        toast.error("Failed to add to cart");
      } finally {
        setAddingId(null);
      }
    },
    [isAuthenticated, isInCart, addToCart, navigate]
  );

  /* ── Don't render if no products and not loading ──────────────────────── */
  if (!loading && products.length === 0) return null;

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{styles}</style>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <section className="rp-section">
        <div className="container-fluid px-4 px-md-5">

          {/* Header */}
          <div className="rp-header">
            <div className="rp-eyebrow">Explore More</div>
            <h2>Related Products</h2>
            <div className="rp-header-bar" />
            <p>You may also like these products</p>
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            className="rp-swiper"
            breakpoints={{
              320:  { slidesPerView: 1 },
              576:  { slidesPerView: 2 },
              992:  { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SwiperSlide key={i}><SkeletonCard /></SwiperSlide>
                ))
              : products.map((item) => (
                  <SwiperSlide key={item._id}>
                    <RelatedCard
                      item={item}
                      inCart={isInCart(item._id)}
                      adding={addingId === item._id}
                      onAddToCart={() => handleAddToCart(item)}
                    />
                  </SwiperSlide>
                ))}
          </Swiper>

        </div>
      </section>
    </>
  );
};

export default RelatedProduct;