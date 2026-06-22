import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/BaseUrl";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_IMG = "/img/no-image.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcDisc = (oldPrice, price) => {
  if (!oldPrice || !price || price >= oldPrice) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

/**
 * Cloudinary-aware image resolver.
 * Backend now stores images as [{ url, public_id }]
 * Falls back gracefully for any edge-case shapes.
 */
const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const first = images[0];
  // Cloudinary object  { url, public_id }
  if (first && typeof first === "object" && first.url) return first.url;
  // Legacy plain string URLs
  if (typeof first === "string") {
    if (first.startsWith("http")) return first;
    if (first.startsWith("/")) return `http://localhost:8080${first}`;
    return `http://localhost:8080/${first}`;
  }
  return FALLBACK_IMG;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bs-o-orange:        #f28b00;
    --bs-o-orange-dark:   #c97200;
    --bs-o-orange-glow:   rgba(242,139,0,0.18);
    --bs-o-orange-border: rgba(242,139,0,0.22);
    --bs-o-orange-light:  #fff8ee;
    --bs-o-dark:          #111111;
    --bs-o-text:          #1c1a18;
    --bs-o-muted:         #8a8480;
    --bs-o-bg:            #f7f4f0;
    --bs-o-surface:       #ffffff;
    --bs-o-border:        #e8e3dc;
    --bs-o-radius-card:   20px;
    --bs-o-radius-btn:    50px;
    --bs-o-transition:    0.38s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── SECTION ── */
  .bs-section {
    background: var(--bs-o-bg);
    padding: 80px 0 100px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .bs-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .bs-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--bs-o-orange);
    margin-bottom: 14px;
  }
  .bs-eyebrow::before,
  .bs-eyebrow::after {
    content: '';
    display: block;
    width: 36px;
    height: 1.5px;
    background: var(--bs-o-orange);
    border-radius: 2px;
  }
  .bs-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 4.5vw, 48px);
    font-weight: 700;
    color: var(--bs-o-dark);
    letter-spacing: -0.8px;
    line-height: 1.1;
    margin: 0 0 16px;
  }
  .bs-header p {
    font-size: 15px;
    color: var(--bs-o-muted);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.75;
  }
  .bs-header-bar {
    width: 52px;
    height: 3px;
    background: var(--bs-o-orange);
    border-radius: 3px;
    margin: 16px auto 0;
  }

  /* ── GRID ── */
  .bs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 22px;
  }

  /* ── CARD ── */
  .bs-card {
    background: var(--bs-o-surface);
    border-radius: var(--bs-o-radius-card);
    border: 1px solid var(--bs-o-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 14px rgba(0,0,0,0.05);
    transition: var(--bs-o-transition);
    position: relative;
  }
  .bs-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 44px rgba(0,0,0,0.10), 0 4px 12px var(--bs-o-orange-glow);
    border-color: var(--bs-o-orange-border);
  }

  /* ── RANK BADGE ── */
  .bs-rank {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 5;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--bs-o-orange);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(242,139,0,0.45);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── TOP ROW ── */
  .bs-top {
    display: flex;
    flex: 1;
  }

  /* IMAGE */
  .bs-img-wrap {
    flex: 0 0 42%;
    position: relative;
    overflow: hidden;
    background: var(--bs-o-orange-light);
    border-right: 1px solid var(--bs-o-border);
    min-height: 180px;
  }
  .bs-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .bs-card:hover .bs-img-wrap img {
    transform: scale(1.07);
  }

  /* Eye button */
  .bs-eye-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 4;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--bs-o-orange);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 13px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(242,139,0,0.45);
    transition: background 0.2s, transform 0.2s, opacity 0.2s;
    transform: scale(0.85);
    opacity: 0;
  }
  .bs-card:hover .bs-eye-btn {
    opacity: 1;
    transform: scale(1);
  }
  .bs-eye-btn:hover {
    background: var(--bs-o-orange-dark);
    color: #fff;
    text-decoration: none;
  }

  /* Hot tag */
  .bs-hot-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 4;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    background: #e03a3a;
    color: #fff;
  }

  /* CONTENT */
  .bs-content {
    flex: 1;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bs-cat {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--bs-o-orange);
    margin-bottom: 6px;
    text-decoration: none;
    display: block;
  }
  .bs-cat:hover { color: var(--bs-o-orange-dark); text-decoration: none; }

  .bs-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--bs-o-text);
    line-height: 1.35;
    margin-bottom: 12px;
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .bs-name:hover { color: var(--bs-o-orange); text-decoration: none; }

  /* Stars */
  .bs-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 10px;
  }
  .bs-star   { color: #f5c842; font-size: 11px; }
  .bs-star-e { color: #ddd;    font-size: 11px; }

  /* Price */
  .bs-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }
  .bs-price {
    font-size: 20px;
    font-weight: 700;
    color: var(--bs-o-orange);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .bs-price-old {
    font-size: 12px;
    color: var(--bs-o-muted);
    text-decoration: line-through;
  }
  .bs-disc {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #fff;
    background: #e03a3a;
    padding: 2px 7px;
    border-radius: 10px;
  }

  /* ── DIVIDER ── */
  .bs-divider {
    height: 1px;
    background: var(--bs-o-border);
  }

  /* ── FOOTER ── */
  .bs-footer {
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .bs-btn-cart {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    padding: 10px 20px;
    border-radius: var(--bs-o-radius-btn);
    border: none;
    cursor: pointer;
    background: var(--bs-o-orange);
    color: #fff;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(242,139,0,0.32);
    transition: var(--bs-o-transition);
  }
  .bs-btn-cart:hover {
    background: var(--bs-o-orange-dark);
    box-shadow: 0 6px 24px rgba(242,139,0,0.45);
    transform: scale(1.03);
    color: #fff;
    text-decoration: none;
  }
  .bs-btn-cart--incart {
    background: #f0ece6 !important;
    color: #8a8480 !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
    pointer-events: none;
    transform: none !important;
  }
  .bs-icon-btns {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .bs-icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid var(--bs-o-border);
    background: transparent;
    color: var(--bs-o-muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--bs-o-transition);
    text-decoration: none;
  }
  .bs-icon-btn:hover {
    border-color: var(--bs-o-orange);
    color: var(--bs-o-orange);
    background: var(--bs-o-orange-light);
    text-decoration: none;
  }

  /* ── SKELETON ── */
  .bs-skel {
    background: var(--bs-o-surface);
    border-radius: var(--bs-o-radius-card);
    border: 1px solid var(--bs-o-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .bs-skel-top  { display: flex; }
  .bs-skel-img  { flex: 0 0 42%; min-height: 180px; }
  .bs-skel-body { flex: 1; padding: 18px 20px; }
  .bs-skel-line { border-radius: 6px; margin-bottom: 10px; }
  .bs-shimmer {
    background: linear-gradient(90deg, #f0ece6 25%, #e6e0d8 50%, #f0ece6 75%);
    background-size: 200% 100%;
    animation: bsShimmer 1.4s infinite;
  }
  @keyframes bsShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }
  .bs-skel-footer {
    height: 60px;
    border-top: 1px solid var(--bs-o-border);
  }

  /* ── EMPTY STATE ── */
  .bs-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: var(--bs-o-muted);
  }
  .bs-empty i { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.35; }
  .bs-empty p { font-size: 16px; margin: 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .bs-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  }
  @media (max-width: 767px) {
    .bs-section { padding: 56px 0 72px; }
    .bs-grid    { grid-template-columns: 1fr; gap: 18px; }
    .bs-img-wrap { min-height: 160px; }
  }
  @media (max-width: 479px) {
    .bs-img-wrap  { flex: 0 0 38%; }
    .bs-content   { padding: 14px 16px; }
    .bs-footer    { padding: 12px 14px; }
    .bs-btn-cart  { font-size: 11px; padding: 9px 16px; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bs-skel">
    <div className="bs-skel-top">
      <div className="bs-skel-img bs-shimmer" />
      <div className="bs-skel-body">
        <div className="bs-skel-line bs-shimmer" style={{ height: 10, width: "45%" }} />
        <div className="bs-skel-line bs-shimmer" style={{ height: 14, width: "85%" }} />
        <div className="bs-skel-line bs-shimmer" style={{ height: 12, width: "60%" }} />
        <div className="bs-skel-line bs-shimmer" style={{ height: 10, width: "40%", marginTop: 14 }} />
      </div>
    </div>
    <div className="bs-skel-footer bs-shimmer" />
  </div>
);

const StarRating = ({ rating = 4 }) => (
  <div className="bs-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <i
        key={n}
        className={`fas fa-star ${n <= rating ? "bs-star" : "bs-star-e"}`}
      />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const BestSeller = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();

  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addingId, setAddingId]     = useState(null); // track which product is being added

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBestSellers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/product/top-selling`);
      setBestSeller(data?.products || []);
    } catch (error) {
      console.error("BestSeller fetch error:", error);
      toast.error("Failed to load bestsellers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBestSellers(); }, [fetchBestSellers]);

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const isInCart = useCallback(
    (id) => cartItems.some((ci) => ci.product._id === id),
    [cartItems]
  );

  const handleAddToCart = async (product) => {
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
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

      <section className="bs-section">
        <div className="container-fluid px-4 px-md-5">

          {/* ── Header ── */}
          <div className="bs-header">
            <div className="bs-eyebrow">Top Picks</div>
            <h2>Bestseller Products</h2>
            <div className="bs-header-bar" />
            <p className="mt-3">
              Discover our most-loved products — handpicked by thousands of happy
              customers and trusted for their quality, value, and style.
            </p>
          </div>

          {/* ── Grid ── */}
          <div className="bs-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : bestSeller.length === 0 ? (
              <div className="bs-empty">
                <i className="fas fa-trophy" />
                <p>No bestsellers found</p>
              </div>
            ) : (
              bestSeller.map((product, index) => {
                const inCart  = isInCart(product._id);
                const adding  = addingId === product._id;
                const disc    = calcDisc(product.oldPrice, product.price);
                const imgSrc  = getImageUrl(product.images);

                return (
                  <div className="bs-card" key={product._id}>

                    {/* Rank badge */}
                    <div className="bs-rank">#{index + 1}</div>

                    {/* ── Top row ── */}
                    <div className="bs-top">

                      {/* Image */}
                      <div className="bs-img-wrap">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />

                        {index < 3 && <span className="bs-hot-tag">Hot</span>}

                        <Link
                          to={`/product-details/${product.slug}`}
                          className="bs-eye-btn"
                          title="View Details"
                        >
                          <i className="fa fa-eye" />
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="bs-content">
                        <Link
                          to={`/products?category=${product.category?.slug || ""}`}
                          className="bs-cat"
                        >
                          {product.category?.name || "Product"}
                        </Link>

                        <Link
                          to={`/product-details/${product.slug}`}
                          className="bs-name"
                        >
                          {product.name}
                        </Link>

                        <StarRating rating={product.rating || 4} />

                        <div className="bs-price-row">
                          <span className="bs-price">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </span>
                          {product.oldPrice && (
                            <span className="bs-price-old">
                              ₹{product.oldPrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                          {disc && <span className="bs-disc">−{disc}%</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bs-divider" />

                    {/* ── Footer ── */}
                    <div className="bs-footer">
                      <button
                        className={`bs-btn-cart${inCart ? " bs-btn-cart--incart" : ""}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={inCart || adding}
                        aria-label={inCart ? "Already in cart" : "Add to cart"}
                      >
                        <i className={`fas ${inCart ? "fa-check" : adding ? "fa-spinner fa-spin" : "fa-shopping-cart"}`} />
                        {inCart ? "In Cart" : adding ? "Adding…" : "Add to Cart"}
                      </button>

                      <div className="bs-icon-btns">
                        <button className="bs-icon-btn" title="Compare" aria-label="Compare">
                          <i className="fas fa-random" />
                        </button>
                        <button className="bs-icon-btn" title="Wishlist" aria-label="Add to wishlist">
                          <i className="fas fa-heart" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default BestSeller;