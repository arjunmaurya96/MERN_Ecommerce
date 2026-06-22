import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import HeroNavbar from "./HeroNavbar";
import ProductOffer from "./ProductOffer";
import Services from "./Services";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/BaseUrl";
import toast, { Toaster } from "react-hot-toast";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const FALLBACK_IMG     = "/img/no-image.png";
const PRODUCTS_PER_PAGE = 6;
const MAX_PRICE         = 10000;

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

/**
 * Cloudinary-aware image resolver.
 * Backend stores images as [{ url, public_id }]
 * Falls back gracefully for legacy string paths.
 */
const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const first = images[0];
  if (first && typeof first === "object" && first.url) return first.url; // ✅ Cloudinary
  if (typeof first === "string") {
    if (first.startsWith("http")) return first;
    if (first.startsWith("/"))    return `${BASE_URL}${first}`;
    return `${BASE_URL}/${first}`;
  }
  return FALLBACK_IMG;
};

const calcDiscount = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */
const styles = `
  :root {
    --sh-orange:        #f28b00;
    --sh-orange-dark:   #c97200;
    --sh-orange-glow:   rgba(242,139,0,0.16);
    --sh-orange-border: rgba(242,139,0,0.25);
    --sh-orange-light:  #fff8ee;
    --sh-dark:          #111111;
    --sh-text:          #1c1a18;
    --sh-muted:         #8a8480;
    --sh-bg:            #f7f4f0;
    --sh-surface:       #ffffff;
    --sh-border:        #e8e3dc;
    --sh-radius:        18px;
    --sh-radius-sm:     10px;
    --sh-radius-pill:   50px;
    --sh-transition:    0.36s cubic-bezier(0.4,0,0.2,1);
    --sh-shadow:        0 2px 16px rgba(0,0,0,0.05);
    --sh-shadow-hover:  0 14px 44px rgba(0,0,0,0.11), 0 4px 12px rgba(242,139,0,0.09);
  }

  /* ── PAGE HEADER ── */
  .sh-page-header {
    background: var(--sh-dark);
    padding: 64px 0 56px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .sh-page-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(242,139,0,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }
  .sh-page-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 48px;
    background: var(--sh-bg);
    clip-path: ellipse(55% 100% at 50% 100%);
  }
  .sh-page-header-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--sh-orange);
    margin-bottom: 10px;
  }
  .sh-page-header-eyebrow::before,
  .sh-page-header-eyebrow::after {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--sh-orange);
    border-radius: 2px;
  }
  .sh-page-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 60px);
    font-weight: 700;
    color: #fff;
    letter-spacing: -1px;
    line-height: 1;
    margin: 0;
    position: relative;
    z-index: 1;
  }
  .sh-page-header h1 span { color: var(--sh-orange); }

  /* ── MAIN LAYOUT ── */
  .sh-main {
    background: var(--sh-bg);
    padding: 48px 0 80px;
    font-family: 'DM Sans', sans-serif;
  }
  .sh-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 28px;
    align-items: start;
  }

  /* ════════════════════
     SIDEBAR
  ════════════════════ */
  .sh-sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 24px;
  }
  .sh-sidebar-card {
    background: var(--sh-surface);
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    padding: 24px;
    box-shadow: var(--sh-shadow);
  }
  .sh-sidebar-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--sh-dark);
    margin: 0 0 18px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--sh-orange);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sh-sidebar-title i { font-size: 13px; color: var(--sh-orange); }

  /* PRICE RANGE */
  .sh-price-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .sh-price-label { font-size: 12px; color: var(--sh-muted); font-weight: 500; }
  .sh-price-badge {
    font-size: 13px;
    font-weight: 700;
    color: var(--sh-orange);
    background: var(--sh-orange-light);
    padding: 3px 12px;
    border-radius: var(--sh-radius-pill);
    border: 1px solid var(--sh-orange-border);
  }
  .sh-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: linear-gradient(
      to right,
      var(--sh-orange) 0%,
      var(--sh-orange) var(--range-pct, 50%),
      var(--sh-border) var(--range-pct, 50%),
      var(--sh-border) 100%
    );
    outline: none;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .sh-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--sh-orange);
    box-shadow: 0 2px 8px rgba(242,139,0,0.45);
    cursor: pointer;
    border: 3px solid #fff;
    transition: transform 0.2s;
  }
  .sh-range::-webkit-slider-thumb:hover { transform: scale(1.15); }
  .sh-range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--sh-muted);
    font-weight: 500;
  }

  /* CATEGORY PILLS */
  .sh-cat-group { margin-bottom: 18px; }
  .sh-cat-group:last-child { margin-bottom: 0; }
  .sh-cat-main-name {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--sh-orange);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sh-cat-main-name::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--sh-border);
    border-radius: 1px;
  }
  .sh-cat-pills { display: flex; flex-wrap: wrap; gap: 7px; }
  .sh-cat-pill {
    font-size: 12px;
    font-weight: 500;
    padding: 5px 14px;
    border-radius: var(--sh-radius-pill);
    border: 1.5px solid var(--sh-border);
    background: var(--sh-bg);
    color: var(--sh-text);
    cursor: pointer;
    transition: var(--sh-transition);
    white-space: nowrap;
    line-height: 1;
    user-select: none;
  }
  .sh-cat-pill:hover {
    border-color: var(--sh-orange);
    color: var(--sh-orange);
    background: var(--sh-orange-light);
  }
  .sh-cat-pill.active {
    background: var(--sh-orange);
    border-color: var(--sh-orange);
    color: #fff;
    box-shadow: 0 4px 14px rgba(242,139,0,0.35);
  }
  .sh-clear-btn {
    width: 100%;
    margin-top: 14px;
    padding: 9px;
    border-radius: var(--sh-radius-pill);
    border: 1.5px solid #e03a3a;
    background: transparent;
    color: #e03a3a;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: var(--sh-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .sh-clear-btn:hover { background: #e03a3a; color: #fff; }

  /* ════════════════════
     MAIN CONTENT AREA
  ════════════════════ */
  .sh-content { min-width: 0; }

  /* ── SALE BANNER ── */
  .sh-banner {
    border-radius: var(--sh-radius);
    overflow: hidden;
    position: relative;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  }
  .sh-banner img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }
  .sh-banner:hover img { transform: scale(1.04); }
  .sh-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(200,114,0,0.88) 0%, rgba(242,139,0,0.65) 55%, rgba(242,139,0,0.35) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }
  .sh-banner-sale {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px, 7vw, 72px);
    font-weight: 700;
    color: #fff;
    line-height: 1;
    letter-spacing: 4px;
    margin-bottom: 4px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .sh-banner-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(15px, 2.5vw, 20px);
    font-weight: 600;
    color: rgba(255,255,255,0.92);
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }
  .sh-banner-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 11px 28px;
    border-radius: var(--sh-radius-pill);
    background: var(--sh-dark);
    color: #fff;
    text-decoration: none;
    transition: var(--sh-transition);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  .sh-banner-btn:hover {
    background: #2a2a2a;
    transform: scale(1.04);
    color: #fff;
    text-decoration: none;
  }

  /* ── SEARCH BAR ── */
  .sh-search-wrap { position: relative; margin-bottom: 24px; }
  .sh-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--sh-muted);
    font-size: 14px;
    pointer-events: none;
  }
  .sh-search {
    width: 100%;
    padding: 14px 18px 14px 46px;
    border-radius: var(--sh-radius-pill);
    border: 1.5px solid var(--sh-border);
    background: var(--sh-surface);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--sh-text);
    outline: none;
    transition: var(--sh-transition);
    box-shadow: var(--sh-shadow);
  }
  .sh-search:focus {
    border-color: var(--sh-orange);
    box-shadow: 0 0 0 4px var(--sh-orange-glow);
  }
  .sh-search::placeholder { color: var(--sh-muted); }

  /* ── RESULTS BAR ── */
  .sh-results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .sh-results-count { font-size: 13px; color: var(--sh-muted); font-weight: 500; }
  .sh-results-count strong { color: var(--sh-orange); font-weight: 700; }

  /* ── EMPTY STATE ── */
  .sh-empty {
    background: var(--sh-surface);
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    padding: 64px 20px;
    text-align: center;
    color: var(--sh-muted);
  }
  .sh-empty i { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.3; }
  .sh-empty p { font-size: 15px; margin: 0; }

  /* ── PRODUCT GRID ── */
  .sh-product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  /* ── PRODUCT CARD ── */
  .sh-card {
    background: var(--sh-surface);
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--sh-shadow);
    transition: var(--sh-transition);
    position: relative;
  }
  .sh-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--sh-shadow-hover);
    border-color: var(--sh-orange-border);
  }

  /* Image */
  .sh-card-img {
    position: relative;
    overflow: hidden;
    background: var(--sh-orange-light);
    aspect-ratio: 4/3;
  }
  .sh-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
  }
  .sh-card:hover .sh-card-img img { transform: scale(1.07); }

  /* Eye overlay */
  .sh-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(17,17,17,0.40);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  .sh-card:hover .sh-img-overlay { opacity: 1; }
  .sh-eye-link {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--sh-orange);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-decoration: none;
    transform: scale(0.8);
    transition: transform 0.3s ease, background 0.2s;
    box-shadow: 0 4px 16px rgba(242,139,0,0.5);
  }
  .sh-card:hover .sh-eye-link { transform: scale(1); }
  .sh-eye-link:hover { background: var(--sh-orange-dark); color: #fff; text-decoration: none; }

  /* Category badge */
  .sh-card-cat {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 11px;
    border-radius: 20px;
    background: rgba(255,255,255,0.95);
    color: var(--sh-orange);
    border: 1px solid var(--sh-orange-border);
    pointer-events: none;
  }

  /* Card body */
  .sh-card-body { padding: 16px 16px 0; flex: 1; display: flex; flex-direction: column; }
  .sh-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--sh-text);
    line-height: 1.35;
    margin: 0 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-decoration: none;
    transition: color 0.2s;
  }
  .sh-card-name:hover { color: var(--sh-orange); text-decoration: none; }

  /* Price */
  .sh-card-price {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .sh-price-current {
    font-size: 18px;
    font-weight: 700;
    color: var(--sh-orange);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .sh-price-old { font-size: 12px; color: var(--sh-muted); text-decoration: line-through; }
  .sh-disc-tag {
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: #e03a3a;
    padding: 2px 7px;
    border-radius: 10px;
    letter-spacing: 0.3px;
  }

  /* Card footer */
  .sh-card-footer {
    border-top: 1px solid var(--sh-border);
    padding: 12px 16px 16px;
    margin-top: auto;
  }
  .sh-btn-cart {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    padding: 10px;
    border-radius: var(--sh-radius-pill);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: var(--sh-orange);
    color: #fff;
    transition: var(--sh-transition);
    box-shadow: 0 4px 14px rgba(242,139,0,0.28);
  }
  .sh-btn-cart:hover:not(:disabled) {
    background: var(--sh-orange-dark);
    box-shadow: 0 6px 22px rgba(242,139,0,0.42);
    transform: scale(1.02);
  }
  .sh-btn-cart:disabled {
    background: #f0ece6;
    color: var(--sh-muted);
    box-shadow: none;
    cursor: not-allowed;
  }
  .sh-btn-cart--adding { opacity: 0.75; cursor: wait !important; }

  /* ── PAGINATION ── */
  .sh-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sh-page-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1.5px solid var(--sh-border);
    background: var(--sh-surface);
    color: var(--sh-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--sh-transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sh-page-btn:hover {
    border-color: var(--sh-orange);
    color: var(--sh-orange);
    background: var(--sh-orange-light);
  }
  .sh-page-btn.active {
    background: var(--sh-orange);
    border-color: var(--sh-orange);
    color: #fff;
    box-shadow: 0 4px 14px rgba(242,139,0,0.38);
  }
  .sh-page-btn-arrow {
    font-size: 11px;
    font-weight: 700;
  }

  /* ── SKELETON ── */
  .sh-skel-card {
    background: var(--sh-surface);
    border-radius: var(--sh-radius);
    border: 1px solid var(--sh-border);
    overflow: hidden;
  }
  .sh-skel-img { aspect-ratio: 4/3; }
  .sh-skel-body { padding: 16px; }
  .sh-skel-line { border-radius: 6px; margin-bottom: 10px; }
  .sh-shimmer {
    background: linear-gradient(90deg, #f0ece6 25%, #e6e0d8 50%, #f0ece6 75%);
    background-size: 200% 100%;
    animation: shShimmer 1.4s infinite;
  }
  @keyframes shShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1199px) {
    .sh-layout       { grid-template-columns: 260px 1fr; }
    .sh-product-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 991px) {
    .sh-layout        { grid-template-columns: 1fr; }
    .sh-sidebar       { position: static; }
    .sh-product-grid  { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 767px) {
    .sh-product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .sh-banner img   { height: 180px; }
  }
  @media (max-width: 479px) {
    .sh-product-grid  { grid-template-columns: 1fr 1fr; gap: 12px; }
    .sh-card-name     { font-size: 13px; }
    .sh-price-current { font-size: 15px; }
    .sh-banner img    { height: 150px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="sh-skel-card">
    <div className="sh-skel-img sh-shimmer" />
    <div className="sh-skel-body">
      <div className="sh-skel-line sh-shimmer" style={{ height: 10, width: "42%" }} />
      <div className="sh-skel-line sh-shimmer" style={{ height: 14, width: "88%" }} />
      <div className="sh-skel-line sh-shimmer" style={{ height: 12, width: "55%" }} />
      <div className="sh-skel-line sh-shimmer" style={{ height: 10, width: "35%", marginTop: 16 }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   PRODUCT CARD  (memoised)
═══════════════════════════════════════════════════════ */
const ProductCard = React.memo(({ item, inCart, adding, onAddToCart }) => {
  const imgSrc   = getImageUrl(item.images);
  const hasDisc  = item.discountPrice > 0 && item.discountPrice < item.price;
  const disc     = hasDisc ? calcDiscount(item.price, item.discountPrice) : null;

  return (
    <div className="sh-card">

      {/* Image */}
      <div className="sh-card-img">
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        {item.category?.name && (
          <span className="sh-card-cat">{item.category.name}</span>
        )}
        <div className="sh-img-overlay">
          <Link to={`/product-details/${item.slug}`} className="sh-eye-link" aria-label="View product">
            <i className="fa fa-eye" />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="sh-card-body">
        <Link to={`/product-details/${item.slug}`} className="sh-card-name">
          {item.name}
        </Link>

        <div className="sh-card-price">
          {hasDisc ? (
            <>
              <span className="sh-price-current">
                ₹{item.discountPrice.toLocaleString("en-IN")}
              </span>
              <span className="sh-price-old">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
              {disc && <span className="sh-disc-tag">−{disc}%</span>}
            </>
          ) : (
            <span className="sh-price-current">
              ₹{item.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sh-card-footer">
        <button
          className={`sh-btn-cart${adding ? " sh-btn-cart--adding" : ""}`}
          onClick={onAddToCart}
          disabled={inCart || adding}
          aria-label={inCart ? "Already in cart" : "Add to cart"}
        >
          <i className={`fas ${inCart ? "fa-check" : adding ? "fa-spinner fa-spin" : "fa-shopping-bag"}`} />
          {inCart ? "In Cart" : adding ? "Adding…" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
});
ProductCard.displayName = "ProductCard";

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const Shops = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();

  const [products,        setProducts]        = useState([]);
  const [mainCategories,  setMainCategories]  = useState([]);
  const [allCategories,   setAllCategories]   = useState([]);
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [price,           setPrice]           = useState(MAX_PRICE);
  const [selectedSub,     setSelectedSub]     = useState(null);
  const [currentPage,     setCurrentPage]     = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId,        setAddingId]        = useState(null); // per-item loading

  /* ── Fetch all data in parallel ───────────────────────────────────────── */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, mainCatRes, allCatRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/product/get-product`),
          axios.get(`${BASE_URL}/api/category/get-main-category`),
          axios.get(`${BASE_URL}/api/category/get-all-category`),
        ]);
        setProducts(prodRes.data.products       || []);
        setMainCategories(mainCatRes.data.data  || []);
        setAllCategories(allCatRes.data.data    || []);
      } catch (error) {
        console.error("Shops fetch error:", error);
        toast.error("Failed to load shop data");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAll();
  }, []);

  /* ── Search debounce ──────────────────────────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Sub-categories for a given main category ─────────────────────────── */
  const getSubCategories = useCallback(
    (mainId) =>
      allCategories.filter(
        (cat) => cat.type === "sub" && cat.parent?._id === mainId
      ),
    [allCategories]
  );

  /* ── Filter products ──────────────────────────────────────────────────── */
  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return products.filter((item) => {
      const effectivePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
      return (
        item.name.toLowerCase().includes(q) &&
        effectivePrice <= price &&
        (!selectedSub || item.category?._id === selectedSub)
      );
    });
  }, [products, debouncedSearch, price, selectedSub]);

  /* ── Pagination ───────────────────────────────────────────────────────── */
  const totalPages     = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex     = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ── Cart helpers ─────────────────────────────────────────────────────── */
  const isInCart = useCallback(
    (id) => cartItems.some((c) => c.product._id === id),
    [cartItems]
  );

  const handleAddToCart = useCallback(
    async (item) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }
      if (isInCart(item._id)) {
        toast.error("Already in cart — update quantity from the cart page");
        return;
      }
      try {
        setAddingId(item._id);
        await addToCart(item, 1);
        toast.success("Added to cart 🛒");
      } catch {
        toast.error("Failed to add to cart");
      } finally {
        setAddingId(null);
      }
    },
    [isAuthenticated, isInCart, navigate, addToCart]
  );

  /* ── Range slider fill % ──────────────────────────────────────────────── */
  const rangePct = `${((price / MAX_PRICE) * 100).toFixed(0)}%`;

  /* ── Filter reset helpers ─────────────────────────────────────────────── */
  const handleSubSelect = (id) => { setSelectedSub(id); setCurrentPage(1); };
  const handlePriceChange = (e) => { setPrice(Number(e.target.value)); setCurrentPage(1); };
  const handleSearchChange = (e) => { setSearch(e.target.value); setCurrentPage(1); };

  /* ═══════════════════
     RENDER
  ═══════════════════ */
  return (
    <>
      <style>{styles}</style>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            border: "1px solid #e8e3dc",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

      <HeroNavbar />

      {/* ── Page header ── */}
      <div className="sh-page-header">
        <div className="sh-page-header-eyebrow">Browse</div>
        <h1>Our <span>Shop</span></h1>
      </div>

      <Services />
      <ProductOffer />

      {/* ── Main shop area ── */}
      <div className="sh-main">
        <div className="container-fluid px-4 px-md-5">
          <div className="sh-layout">

            {/* ════════ SIDEBAR ════════ */}
            <aside className="sh-sidebar">

              {/* Price filter */}
              <div className="sh-sidebar-card">
                <h3 className="sh-sidebar-title">
                  <i className="fas fa-sliders-h" /> Filter by Price
                </h3>
                <div className="sh-price-display">
                  <span className="sh-price-label">Max price</span>
                  <span className="sh-price-badge">₹{Number(price).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  className="sh-range"
                  min="0"
                  max={MAX_PRICE}
                  value={price}
                  style={{ "--range-pct": rangePct }}
                  onChange={handlePriceChange}
                />
                <div className="sh-range-labels">
                  <span>₹0</span>
                  <span>₹{MAX_PRICE.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Category filter */}
              <div className="sh-sidebar-card">
                <h3 className="sh-sidebar-title">
                  <i className="fas fa-tags" /> Categories
                </h3>

                {mainCategories.map((main) => {
                  const subs = getSubCategories(main._id);
                  if (subs.length === 0) return null;
                  return (
                    <div className="sh-cat-group" key={main._id}>
                      <div className="sh-cat-main-name">{main.name}</div>
                      <div className="sh-cat-pills">
                        {subs.map((sub) => (
                          <span
                            key={sub._id}
                            role="button"
                            tabIndex={0}
                            className={`sh-cat-pill${selectedSub === sub._id ? " active" : ""}`}
                            onClick={() => handleSubSelect(sub._id)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubSelect(sub._id)}
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {selectedSub && (
                  <button className="sh-clear-btn" onClick={() => { setSelectedSub(null); setCurrentPage(1); }}>
                    <i className="fas fa-times" /> Clear Filter
                  </button>
                )}
              </div>

            </aside>

            {/* ════════ CONTENT ════════ */}
            <div className="sh-content">

              {/* Sale banner */}
              <div className="sh-banner">
                <img src="/img/product-banner-3.jpg" alt="Sale Banner" />
                <div className="sh-banner-overlay">
                  <div className="sh-banner-sale">SALE</div>
                  <div className="sh-banner-sub">Get Up To 50% Off</div>
                  <Link to="/products" className="sh-banner-btn">
                    Shop Now <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </div>

              {/* Search */}
              <div className="sh-search-wrap">
                <i className="fas fa-search sh-search-icon" />
                <input
                  type="search"
                  className="sh-search"
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Results bar */}
              {!loadingProducts && (
                <div className="sh-results-bar">
                  <span className="sh-results-count">
                    Showing <strong>{currentProducts.length}</strong> of{" "}
                    <strong>{filteredProducts.length}</strong> products
                  </span>
                </div>
              )}

              {/* Empty state */}
              {!loadingProducts && currentProducts.length === 0 && (
                <div className="sh-empty">
                  <i className="fas fa-box-open" />
                  <p>No products found. Try adjusting your filters.</p>
                </div>
              )}

              {/* Product grid */}
              <div className="sh-product-grid">
                {loadingProducts
                  ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : currentProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        item={item}
                        inCart={isInCart(item._id)}
                        adding={addingId === item._id}
                        onAddToCart={() => handleAddToCart(item)}
                      />
                    ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="sh-pagination">
                  {/* Prev */}
                  <button
                    className="sh-page-btn sh-page-btn-arrow"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <i className="fas fa-chevron-left" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`sh-page-btn${currentPage === page ? " active" : ""}`}
                      onClick={() => goToPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    className="sh-page-btn sh-page-btn-arrow"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shops;