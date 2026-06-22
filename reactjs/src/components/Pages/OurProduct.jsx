import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../../services/BaseUrl";

/* ─────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────── */
const FALLBACK_IMG = "/img/no-image.png";
const NEW_PRODUCT_DAYS = 7;

const TABS = [
  { key: "all",      label: "All Products" },
  { key: "new",      label: "New Arrivals" },
  { key: "featured", label: "Featured"     },
  { key: "top",      label: "Top Selling"  },
];

const TAB_URLS = {
  all:      `${BASE_URL}/api/product/get-product`,
  new:      `${BASE_URL}/api/product/products/new-arrivals`,
  featured: `${BASE_URL}/api/product/get-feature-product`,
  top:      `${BASE_URL}/api/product/top-selling`,
};

/* ─────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────── */
const calcDiscount = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};

/**
 * Cloudinary-aware image resolver.
 * Backend stores images as [{ url, public_id }]
 * Falls back gracefully for legacy string paths.
 */
const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const first = images[0];
  // Cloudinary object { url, public_id }
  if (first && typeof first === "object" && first.url) return first.url;
  // Legacy string
  if (typeof first === "string") {
    if (first.startsWith("http")) return first;
    if (first.startsWith("/"))    return `${BASE_URL}${first}`;
    return `${BASE_URL}/${first}`;
  }
  return FALLBACK_IMG;
};

const isNewProduct = (createdAt) =>
  new Date(createdAt) > new Date(Date.now() - NEW_PRODUCT_DAYS * 86400_000);

/* ─────────────────────────────────────────
   STYLES
   ───────────────────────────────────────── */
const styles = `
  :root {
    --clr-bg:           #f7f5f2;
    --clr-surface:      #ffffff;
    --clr-primary:      #1a1a2e;
    --clr-accent:       #c8963e;
    --clr-accent-light: #f5e6cc;
    --clr-muted:        #7a7670;
    --clr-border:       #e8e4de;
    --clr-tag:          #f0ece6;
    --radius-card:      18px;
    --radius-btn:       50px;
    --shadow-card:      0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-hover:     0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
    --transition:       0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .op-section {
    background: var(--clr-bg);
    padding: 80px 0 100px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .op-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 48px;
  }
  .op-title-block .op-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--clr-accent);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .op-title-block .op-eyebrow::before {
    content: '';
    display: inline-block;
    width: 28px;
    height: 1.5px;
    background: var(--clr-accent);
    border-radius: 2px;
  }
  .op-title-block h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 700;
    color: var(--clr-primary);
    line-height: 1.1;
    margin: 0;
    letter-spacing: -1px;
  }

  /* ── TABS ── */
  .op-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .op-tab-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 9px 22px;
    border-radius: var(--radius-btn);
    border: 1.5px solid var(--clr-border);
    background: var(--clr-surface);
    color: var(--clr-muted);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    letter-spacing: 0.3px;
    outline: none;
  }
  .op-tab-btn:hover {
    border-color: var(--clr-accent);
    color: var(--clr-accent);
    background: var(--clr-accent-light);
  }
  .op-tab-btn.active {
    background: var(--clr-primary);
    border-color: var(--clr-primary);
    color: #fff;
    box-shadow: 0 4px 16px rgba(26,26,46,0.22);
  }

  /* ── GRID ── */
  .op-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 28px;
  }

  /* ── CARD ── */
  .op-card {
    background: var(--clr-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    border: 1px solid var(--clr-border);
    overflow: hidden;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .op-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-6px);
    border-color: transparent;
  }

  /* IMAGE */
  .op-card-img-wrap {
    position: relative;
    overflow: hidden;
    background: var(--clr-tag);
    aspect-ratio: 4 / 3.6;
  }
  .op-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
  }
  .op-card:hover .op-card-img-wrap img { transform: scale(1.07); }

  /* NEW BADGE */
  .op-badge-new {
    position: absolute;
    top: 14px;
    left: 14px;
    background: var(--clr-accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    z-index: 2;
    pointer-events: none;
  }

  /* OVERLAY */
  .op-overlay {
    position: absolute;
    inset: 0;
    background: rgba(26,26,46,0.45);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: opacity 0.3s ease;
    z-index: 3;
  }
  .op-card:hover .op-overlay { opacity: 1; }
  .op-overlay-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.95);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--clr-primary);
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s, transform 0.25s;
    transform: translateY(10px);
    text-decoration: none;
  }
  .op-card:hover .op-overlay-btn         { transform: translateY(0); }
  .op-card:hover .op-overlay-btn:nth-child(2) { transition-delay: 0.05s; }
  .op-card:hover .op-overlay-btn:nth-child(3) { transition-delay: 0.10s; }
  .op-overlay-btn:hover {
    background: var(--clr-accent);
    color: #fff;
  }

  /* CARD BODY */
  .op-card-body { padding: 20px 20px 0; flex: 1; }
  .op-card-category {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--clr-accent);
    margin-bottom: 8px;
  }
  .op-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 600;
    color: var(--clr-primary);
    text-decoration: none;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 12px;
    transition: color 0.2s;
  }
  .op-card-name:hover { color: var(--clr-accent); text-decoration: none; }

  /* PRICE */
  .op-price-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .op-price-current {
    font-size: 20px;
    font-weight: 700;
    color: var(--clr-primary);
    font-variant-numeric: tabular-nums;
  }
  .op-price-original {
    font-size: 13px;
    color: var(--clr-muted);
    text-decoration: line-through;
  }
  .op-discount-tag {
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    background: #e03a3a;
    padding: 2px 8px;
    border-radius: 10px;
    letter-spacing: 0.3px;
  }

  /* STARS */
  .op-stars { display: flex; gap: 2px; margin-bottom: 18px; }
  .op-star       { color: #f5c842; font-size: 13px; }
  .op-star.empty { color: #ddd; }

  /* DIVIDER */
  .op-card-divider { height: 1px; background: var(--clr-border); margin: 0; }

  /* CARD FOOTER */
  .op-card-footer {
    padding: 16px 20px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .op-btn-cart {
    flex: 1;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 11px 20px;
    border-radius: var(--radius-btn);
    border: none;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--clr-primary);
    color: #fff;
  }
  .op-btn-cart:hover:not(:disabled) {
    background: var(--clr-accent);
    transform: scale(1.02);
  }
  .op-btn-cart:disabled {
    background: var(--clr-tag);
    color: var(--clr-muted);
    cursor: not-allowed;
    border: 1.5px solid var(--clr-border);
  }
  .op-btn-cart--adding {
    opacity: 0.75;
    cursor: wait !important;
  }
  .op-icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--clr-border);
    background: transparent;
    color: var(--clr-muted);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    flex-shrink: 0;
  }
  .op-icon-btn:hover {
    border-color: var(--clr-accent);
    color: var(--clr-accent);
    background: var(--clr-accent-light);
  }

  /* ── SKELETON ── */
  .op-skeleton {
    background: var(--clr-surface);
    border-radius: var(--radius-card);
    border: 1px solid var(--clr-border);
    overflow: hidden;
  }
  .op-skel-img {
    aspect-ratio: 4 / 3.6;
    background: linear-gradient(90deg, var(--clr-tag) 25%, var(--clr-border) 50%, var(--clr-tag) 75%);
    background-size: 200%;
    animation: opShimmer 1.4s infinite;
  }
  .op-skel-body { padding: 20px; }
  .op-skel-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--clr-tag) 25%, var(--clr-border) 50%, var(--clr-tag) 75%);
    background-size: 200%;
    animation: opShimmer 1.4s infinite;
    margin-bottom: 10px;
  }
  @keyframes opShimmer {
    0%   { background-position:  200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── EMPTY STATE ── */
  .op-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 0;
    color: var(--clr-muted);
  }
  .op-empty i { font-size: 48px; margin-bottom: 16px; display: block; opacity: 0.4; }
  .op-empty p { font-size: 15px; margin: 0; }

  /* ── SECTION FOOTER ── */
  .op-section-footer {
    margin-top: 56px;
    display: flex;
    justify-content: center;
  }
  .op-see-all {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--clr-primary);
    text-decoration: none;
    padding: 14px 40px;
    border: 2px solid var(--clr-primary);
    border-radius: var(--radius-btn);
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .op-see-all:hover {
    background: var(--clr-primary);
    color: #fff;
    text-decoration: none;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .op-header { flex-direction: column; align-items: flex-start; }
    .op-tabs   { justify-content: flex-start; }
  }
  @media (max-width: 767px) {
    .op-section { padding: 56px 0 72px; }
    .op-grid    { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
  }
  @media (max-width: 479px) {
    .op-grid          { grid-template-columns: 1fr 1fr; gap: 16px; }
    .op-card-name     { font-size: 14px; }
    .op-price-current { font-size: 17px; }
  }
  @media (max-width: 359px) {
    .op-grid { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────
   SKELETON CARD
   ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="op-skeleton">
    <div className="op-skel-img" />
    <div className="op-skel-body">
      <div className="op-skel-line" style={{ width: "45%", height: 10 }} />
      <div className="op-skel-line" style={{ width: "80%" }} />
      <div className="op-skel-line" style={{ width: "60%" }} />
      <div className="op-skel-line" style={{ width: "40%", height: 10, marginTop: 20 }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────
   STAR RATING
   ───────────────────────────────────────── */
const StarRating = ({ rating = 4 }) => (
  <div className="op-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <i key={n} className={`fas fa-star op-star${n > rating ? " empty" : ""}`} />
    ))}
  </div>
);

/* ─────────────────────────────────────────
   PRODUCT CARD
   ───────────────────────────────────────── */
const ProductCard = React.memo(({ product, imageUrl, inCart, adding, onAddToCart }) => {
  const showNew  = isNewProduct(product.createdAt);
  const discount = calcDiscount(product.price, product.discountPrice);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div className="op-card">

      {/* ── Image ── */}
      <div className="op-card-img-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        {showNew && <span className="op-badge-new">New</span>}

        {/* Hover overlay */}
        <div className="op-overlay">
          <Link
            to={`/product-details/${product.slug}`}
            className="op-overlay-btn"
            title="Quick View"
          >
            <i className="fas fa-eye" />
          </Link>
          <button className="op-overlay-btn" title="Wishlist" aria-label="Add to wishlist">
            <i className="fas fa-heart" />
          </button>
          <button className="op-overlay-btn" title="Compare" aria-label="Compare product">
            <i className="fas fa-random" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="op-card-body">
        {product.category?.name && (
          <div className="op-card-category">{product.category.name}</div>
        )}

        <Link to={`/product-details/${product.slug}`} className="op-card-name">
          {product.name}
        </Link>

        {/* Price */}
        <div className="op-price-row">
          {hasDiscount ? (
            <>
              <span className="op-price-current">
                ₹{product.discountPrice.toLocaleString("en-IN")}
              </span>
              <span className="op-price-original">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {discount && <span className="op-discount-tag">−{discount}%</span>}
            </>
          ) : (
            <span className="op-price-current">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <StarRating rating={product.rating || 4} />
      </div>

      <div className="op-card-divider" />

      {/* ── Footer ── */}
      <div className="op-card-footer">
        <button
          className={`op-btn-cart${adding ? " op-btn-cart--adding" : ""}`}
          onClick={onAddToCart}
          disabled={inCart || adding}
          aria-label={inCart ? "Already in cart" : "Add to cart"}
        >
          <i className={`fas ${inCart ? "fa-check" : adding ? "fa-spinner fa-spin" : "fa-shopping-bag"}`} />
          {inCart ? "In Cart" : adding ? "Adding…" : "Add to Cart"}
        </button>

        <button className="op-icon-btn" title="Wishlist" aria-label="Add to wishlist">
          <i className="fas fa-heart" />
        </button>
      </div>

    </div>
  );
});

ProductCard.displayName = "ProductCard";

/* ─────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────── */
const OurProduct = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [addingId,  setAddingId]  = useState(null); // per-item loading

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (tab) => {
    try {
      setLoading(true);
      setProducts([]);
      const { data } = await axios.get(TAB_URLS[tab], { timeout: 8000 });

      if (data.success && Array.isArray(data.products)) {
        setProducts(tab === "all" ? data.products.slice(0, 8) : data.products);
      }
    } catch (error) {
      console.error("OurProduct fetch error:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(activeTab); }, [activeTab, fetchProducts]);

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const isInCart = useCallback(
    (id) => cartItems.some((ci) => ci.product._id === id),
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

  // ── Memoised cards ─────────────────────────────────────────────────────────
  const productCards = useMemo(
    () =>
      products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          imageUrl={getImageUrl(product.images)}
          inCart={isInCart(product._id)}
          adding={addingId === product._id}
          onAddToCart={() => handleAddToCart(product)}
        />
      )),
    [products, isInCart, addingId, handleAddToCart]
  );

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
            border: "1px solid #e8e4de",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

      <section className="op-section">
        <div className="container-fluid px-4 px-md-5">

          {/* ── Header ── */}
          <div className="op-header">
            <div className="op-title-block">
              <div className="op-eyebrow">Curated Collection</div>
              <h2>Our Products</h2>
            </div>

            <nav className="op-tabs" aria-label="Product category tabs">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`op-tab-btn${activeTab === key ? " active" : ""}`}
                  onClick={() => setActiveTab(key)}
                  aria-pressed={activeTab === key}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Grid ── */}
          <div className="op-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : products.length === 0 ? (
              <div className="op-empty">
                <i className="fas fa-box-open" />
                <p>No products found in this category</p>
              </div>
            ) : (
              productCards
            )}
          </div>

          {/* ── See all ── */}
          {!loading && products.length > 0 && (
            <div className="op-section-footer">
              <Link to="/products" className="op-see-all">
                Explore All Products
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default React.memo(OurProduct);