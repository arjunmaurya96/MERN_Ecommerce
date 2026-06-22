import React, { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
import { BASE_URL } from "../../services/BaseUrl";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   STYLES
   ───────────────────────────────────────── */
const styles = `
  :root {
    --pl-orange: #f28b00;
    --pl-orange-dark: #c97200;
    --pl-orange-light: #fff8ee;
    --pl-orange-border: rgba(242,139,0,0.25);
    --pl-dark: #111111;
    --pl-text: #1a1a1a;
    --pl-muted: #888480;
    --pl-bg: #f7f4f0;
    --pl-surface: #ffffff;
    --pl-border: #e8e3dc;
    --pl-radius: 18px;
    --pl-transition: 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .pl-section {
    background: var(--pl-bg);
    padding: 80px 0 100px;
  }

  /* ── HEADER ── */
  .pl-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .pl-header-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--pl-orange);
    margin-bottom: 14px;
  }
  .pl-header-eyebrow::before,
  .pl-header-eyebrow::after {
    content: '';
    display: block;
    width: 32px;
    height: 1.5px;
    background: var(--pl-orange);
    border-radius: 2px;
  }
  .pl-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 50px);
    font-weight: 700;
    color: var(--pl-dark);
    letter-spacing: -1px;
    line-height: 1.1;
    margin: 0;
  }
  .pl-header-line {
    width: 56px;
    height: 3px;
    background: var(--pl-orange);
    border-radius: 3px;
    margin: 16px auto 0;
  }

  /* ── GRID ── */
  .pl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 26px;
  }

  /* ── CARD ── */
  .pl-card {
    background: var(--pl-surface);
    border-radius: var(--pl-radius);
    border: 1px solid var(--pl-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
    transition: var(--pl-transition);
    position: relative;
  }
  .pl-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.11), 0 4px 12px rgba(242,139,0,0.08);
    border-color: var(--pl-orange-border);
  }

  /* ── IMAGE ── */
  .pl-img-wrap {
    position: relative;
    overflow: hidden;
    background: var(--pl-orange-light);
    aspect-ratio: 4 / 3.4;
    flex-shrink: 0;
  }
  .pl-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .pl-card:hover .pl-img-wrap img {
    transform: scale(1.07);
  }

  /* OVERLAY on hover */
  .pl-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(17,17,17,0.42);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.35s ease;
    z-index: 2;
  }
  .pl-card:hover .pl-img-overlay { opacity: 1; }
  .pl-overlay-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 11px 22px;
    border-radius: 50px;
    background: var(--pl-surface);
    color: var(--pl-dark);
    text-decoration: none;
    transform: translateY(10px);
    transition: transform 0.35s ease, background 0.2s;
  }
  .pl-card:hover .pl-overlay-btn { transform: translateY(0); }
  .pl-overlay-btn:hover {
    background: var(--pl-orange);
    color: #fff;
    text-decoration: none;
  }

  /* CATEGORY PILL */
  .pl-category {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 3;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(255,255,255,0.95);
    color: var(--pl-orange);
    backdrop-filter: blur(4px);
    border: 1px solid var(--pl-orange-border);
  }

  /* ── CARD BODY ── */
  .pl-body {
    padding: 20px 20px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .pl-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--pl-text);
    margin: 0 0 12px;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* PRICE */
  .pl-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }
  .pl-price {
    font-size: 22px;
    font-weight: 700;
    color: var(--pl-orange);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .pl-price-old {
    font-size: 13px;
    color: var(--pl-muted);
    text-decoration: line-through;
  }
  .pl-discount-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #fff;
    background: #e03a3a;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 2px;
  }

  /* STARS */
  .pl-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 16px;
  }
  .pl-star       { color: #f5c842; font-size: 11px; }
  .pl-star-empty { color: #ddd;    font-size: 11px; }

  /* DIVIDER */
  .pl-divider {
    height: 1px;
    background: var(--pl-border);
    margin: 0 -20px;
  }

  /* ── FOOTER ── */
  .pl-footer {
    padding: 14px 20px 18px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .pl-btn-cart {
    flex: 1;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 10px 16px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: var(--pl-orange);
    color: #fff;
    transition: var(--pl-transition);
    box-shadow: 0 4px 16px rgba(242,139,0,0.3);
    min-width: 0;
  }
  .pl-btn-cart:hover:not(:disabled) {
    background: var(--pl-orange-dark);
    box-shadow: 0 6px 24px rgba(242,139,0,0.45);
    transform: scale(1.02);
  }
  .pl-btn-cart:disabled {
    background: #f0ece6;
    color: var(--pl-muted);
    box-shadow: none;
    cursor: not-allowed;
  }
  /* Per-item spinner state */
  .pl-btn-cart.adding {
    background: var(--pl-orange-dark);
    cursor: not-allowed;
    pointer-events: none;
  }
  .pl-btn-wish {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--pl-border);
    background: transparent;
    color: var(--pl-muted);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--pl-transition);
    flex-shrink: 0;
  }
  .pl-btn-wish:hover {
    border-color: #e03a3a;
    color: #e03a3a;
    background: #fff0f0;
  }

  /* ── SKELETON ── */
  .pl-skeleton {
    background: var(--pl-surface);
    border-radius: var(--pl-radius);
    border: 1px solid var(--pl-border);
    overflow: hidden;
  }
  .pl-skel-block {
    background: linear-gradient(90deg, #f0ece6 25%, #e8e3dc 50%, #f0ece6 75%);
    background-size: 200% 100%;
    animation: plShimmer 1.4s infinite;
  }
  .pl-skel-img { aspect-ratio: 4/3.4; }
  .pl-skel-body { padding: 20px; }
  .pl-skel-line {
    height: 12px;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  @keyframes plShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── EMPTY / ERROR ── */
  .pl-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: var(--pl-muted);
  }
  .pl-state i { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.35; }
  .pl-state p { font-size: 16px; margin: 0 0 20px; }
  .pl-state-err { color: #e03a3a; }
  .pl-retry-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 26px; border-radius: 50px; border: none;
    background: var(--pl-orange); color: #fff;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: background 0.2s;
  }
  .pl-retry-btn:hover { background: var(--pl-orange-dark); }

  /* ── RESPONSIVE ── */
  @media (max-width: 767px) {
    .pl-section { padding: 56px 0 72px; }
    .pl-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
  }
  @media (max-width: 479px) {
    .pl-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
    .pl-name { font-size: 14px; }
    .pl-price { font-size: 18px; }
    .pl-body { padding: 14px 14px 0; }
    .pl-footer { padding: 12px 14px 16px; gap: 8px; }
  }
  @media (max-width: 360px) {
    .pl-grid { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────
   CONSTANTS (outside component)
   ───────────────────────────────────────── */
const FALLBACK_IMG   = "/img/no-image.png";
const PRODUCTS_URL   = `${BASE_URL}/api/product/get-product`;
const STAR_RANGE     = [1, 2, 3, 4, 5];

/* ─── Cloudinary-aware image resolver ─── */
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMG;
  if (typeof img === "object" && img.url) return img.url;    // Cloudinary { url, public_id }
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/"))    return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return FALLBACK_IMG;
};

/* ─── Discount calc ─── */
const calcDiscount = (original, current) => {
  if (!original || !current || current >= original) return null;
  return Math.round(((original - current) / original) * 100);
};

/* ─────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────── */

/* ── SkeletonCard ── */
const SkeletonCard = memo(() => (
  <div className="pl-skeleton">
    <div className="pl-skel-block pl-skel-img" />
    <div className="pl-skel-body">
      <div className="pl-skel-block pl-skel-line" style={{ width: "42%", height: "10px" }} />
      <div className="pl-skel-block pl-skel-line" style={{ width: "85%" }} />
      <div className="pl-skel-block pl-skel-line" style={{ width: "60%" }} />
      <div className="pl-skel-block pl-skel-line" style={{ width: "45%", height: "10px", marginTop: "18px" }} />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

/* ── StarRating ── */
const StarRating = memo(({ rating = 4 }) => (
  <div className="pl-stars" aria-label={`${rating} out of 5 stars`}>
    {STAR_RANGE.map((n) => (
      <i
        key={n}
        className={`fas fa-star ${n <= rating ? "pl-star" : "pl-star-empty"}`}
        aria-hidden="true"
      />
    ))}
  </div>
));
StarRating.displayName = "StarRating";

/* ── EmptyState ── */
const EmptyState = memo(({ error, onRetry }) => (
  <div className={`pl-state ${error ? "pl-state-err" : ""}`}>
    <i
      className={`fas ${error ? "fa-exclamation-circle" : "fa-box-open"}`}
      aria-hidden="true"
    />
    <p>{error || "No products found"}</p>
    {error && (
      <button className="pl-retry-btn" onClick={onRetry}>
        <i className="fas fa-redo" aria-hidden="true" /> Try Again
      </button>
    )}
  </div>
));
EmptyState.displayName = "EmptyState";

/* ── ProductCard ── */
const ProductCard = memo(({ product, isAdding, isInCart, onAddToCart }) => {
  const imgSrc      = getImageUrl(product.images?.[0]);
  const discount    = calcDiscount(product.oldPrice, product.price);
  const priceStr    = `₹${product.price?.toLocaleString("en-IN")}`;
  const oldPriceStr = product.oldPrice
    ? `₹${product.oldPrice?.toLocaleString("en-IN")}`
    : null;

  /* Button label / icon */
  let btnIcon  = "fa-shopping-bag";
  let btnLabel = "Add to Cart";
  let btnClass = "pl-btn-cart";
  if (isAdding) { btnIcon = "fa-spinner fa-spin"; btnLabel = "Adding…"; btnClass += " adding"; }
  else if (isInCart) { btnIcon = "fa-check"; btnLabel = "In Cart"; }

  return (
    <article className="pl-card">

      {/* IMAGE */}
      <div className="pl-img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />

        {product.category?.name && (
          <span className="pl-category">{product.category.name}</span>
        )}

        <div className="pl-img-overlay">
          <Link
            to={`/product-details/${product.slug}`}
            className="pl-overlay-btn"
            aria-label={`View details for ${product.name}`}
          >
            <i className="fas fa-eye" aria-hidden="true" />
            View Details
          </Link>
        </div>
      </div>

      {/* BODY */}
      <div className="pl-body">
        <h3 className="pl-name">{product.name}</h3>

        <div className="pl-price-row">
          <span className="pl-price">{priceStr}</span>
          {oldPriceStr && (
            <span className="pl-price-old">{oldPriceStr}</span>
          )}
          {discount && (
            <span className="pl-discount-badge">-{discount}%</span>
          )}
        </div>

        {/* Dynamic stars — uses product.rating if available, defaults to 4 */}
        <StarRating rating={product.rating ?? 4} />
      </div>

      <div className="pl-divider" />

      {/* FOOTER */}
      <div className="pl-footer">
        <button
          className={btnClass}
          onClick={() => onAddToCart(product)}
          disabled={isAdding || isInCart}
          aria-label={isInCart ? `${product.name} already in cart` : `Add ${product.name} to cart`}
        >
          <i className={`fas ${btnIcon}`} aria-hidden="true" />
          {btnLabel}
        </button>

        <button
          className="pl-btn-wish"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <i className="fas fa-heart" aria-hidden="true" />
        </button>
      </div>

    </article>
  );
});
ProductCard.displayName = "ProductCard";

/* ─────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────── */
const ProductList = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated, cartItems } = useAuth();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [addingId, setAddingId]   = useState(null);

  /* ── Fetch ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(PRODUCTS_URL);
      setProducts(res?.data?.products || []);
    } catch (err) {
      console.error("ProductList fetch error:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── Add to Cart ── */
  const handleAddToCart = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }
      const alreadyInCart = cartItems.some(
        (item) => item.product._id === product._id
      );
      if (alreadyInCart) {
        toast.error("Already added to cart");
        return;
      }
      setAddingId(product._id);
      try {
        await addToCart(product, 1);
        toast.success("Product added to cart 🛒");
      } catch {
        toast.error("Failed to add product");
      } finally {
        setAddingId(null);
      }
    },
    [isAuthenticated, cartItems, addToCart, navigate]
  );

  /* ── isInCart helper ── */
  const isInCart = useCallback(
    (id) => cartItems.some((item) => item.product._id === id),
    [cartItems]
  );

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>

      <section className="pl-section" aria-label="Product listing">
        <div className="container-fluid px-4 px-md-5">

          {/* HEADER */}
          <div className="pl-header">
            <div className="pl-header-eyebrow" aria-hidden="true">All Products</div>
            <h2>Explore Our Collection</h2>
            <div className="pl-header-line" />
          </div>

          {/* GRID */}
          <div className="pl-grid" role="list" aria-label="Products">

            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div role="listitem" key={i}><SkeletonCard /></div>
              ))
            ) : (error || products.length === 0) ? (
              <EmptyState error={error} onRetry={fetchProducts} />
            ) : (
              products.map((product) => (
                <div role="listitem" key={product._id}>
                  <ProductCard
                    product={product}
                    isAdding={addingId === product._id}
                    isInCart={isInCart(product._id)}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))
            )}

          </div>

        </div>
      </section>
    </>
  );
};

export default ProductList;