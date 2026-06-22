import React, {
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
  memo,
} from "react";
import HeroNavbar from "./HeroNavbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/BaseUrl";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Services from "./Services";
import ProductOffer from "./ProductOffer";

// ─── Lazy load heavy sections ──────────────────────────────────────────────
const OurProduct = lazy(() => import("./OurProduct"));
const ProductList = lazy(() => import("./ProductList"));

// ─── Constants ────────────────────────────────────────────────────────────
const FALLBACK_IMG = "/img/no-image.png";
const TOP_SELLING_URL = `${BASE_URL}/api/product/top-selling`;

// ─── Orange primary color tokens ──────────────────────────────────────────
const COLOR = {
  primary: "#FF6B00",
  primaryHover: "#e05e00",
  primaryLight: "#fff3ec",
  primaryText: "#FF6B00",
  skeleton: "#e9ecef",
};

// ─── Shared inline styles (defined once, reused) ──────────────────────────
const SHIMMER_BLOCK = {
  background: COLOR.skeleton,
  animation: "pulse 1.5s ease-in-out infinite",
};

// ─── Cloudinary-aware image resolver ──────────────────────────────────────
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMG;
  if (typeof img === "object" && img.url) return img.url;
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return FALLBACK_IMG;
};

// ─── Global styles injected once ──────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* Override Bootstrap primary with orange */
  .bs-page .btn-primary {
    background-color: ${COLOR.primary} !important;
    border-color:     ${COLOR.primary} !important;
    color: #fff !important;
  }
  .bs-page .btn-primary:hover:not(:disabled) {
    background-color: ${COLOR.primaryHover} !important;
    border-color:     ${COLOR.primaryHover} !important;
  }
  .bs-page .btn-primary:disabled {
    background-color: ${COLOR.primary} !important;
    border-color:     ${COLOR.primary} !important;
    opacity: 0.65;
  }
  .bs-page .text-primary {
    color: ${COLOR.primaryText} !important;
  }
  .bs-page .bg-primary-icon {
    background-color: ${COLOR.primary} !important;
  }
  .bs-page .spinner-border {
    color: #fff !important;
  }
  /* Retry button in EmptyState */
  .bs-page .btn-retry {
    background-color: ${COLOR.primary};
    border-color:     ${COLOR.primary};
    color: #fff;
    border-radius: 50px;
    padding: 8px 28px;
  }
  .bs-page .btn-retry:hover {
    background-color: ${COLOR.primaryHover};
    border-color:     ${COLOR.primaryHover};
    color: #fff;
  }
`;

// ─── SkeletonCard ──────────────────────────────────────────────────────────
const SkeletonCard = memo(() => (
  <div className="col-md-6 col-lg-6 col-xl-4">
    <div className="products-mini-item border h-100">
      <div className="row g-0">
        <div className="col-5">
          <div
            className="products-mini-img border-end h-100"
            style={{ ...SHIMMER_BLOCK, minHeight: 130 }}
          />
        </div>
        <div className="col-7 p-3">
          <div style={{ ...SHIMMER_BLOCK, height: 12, width: "60%", borderRadius: 4, marginBottom: 10 }} />
          <div style={{ ...SHIMMER_BLOCK, height: 14, width: "85%", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ ...SHIMMER_BLOCK, height: 14, width: "40%", borderRadius: 4 }} />
        </div>
      </div>
      <div className="products-mini-add border p-3">
        <div style={{ ...SHIMMER_BLOCK, height: 38, borderRadius: 50 }} />
      </div>
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

// ─── EmptyState ────────────────────────────────────────────────────────────
const EmptyState = memo(({ onRetry }) => (
  <div className="col-12 text-center py-5">
    <i className="fas fa-box-open fa-3x text-muted mb-3" />
    <h2 className="h5 mt-3 mb-2">No bestsellers found</h2>
    <p className="text-muted mb-4">
      We couldn't load the products right now. Please try again.
    </p>
    <button className="btn-retry" onClick={onRetry}>
      Retry
    </button>
  </div>
));
EmptyState.displayName = "EmptyState";

// ─── ProductCard ───────────────────────────────────────────────────────────
const ProductCard = memo(({ product, isAdding, isInCart, onAddToCart }) => {
  const imgSrc = getImageUrl(product.images?.[0]);
  const displayPrice    = `₹${product.price?.toLocaleString("en-IN")}`;
  const displayOldPrice = product.oldPrice
    ? `₹${product.oldPrice?.toLocaleString("en-IN")}`
    : null;

  return (
    <div className="col-md-6 col-lg-6 col-xl-4">
      <div className="products-mini-item border h-100">

        {/* IMAGE */}
        <div className="row g-0">
          <div className="col-5">
            <div className="products-mini-img border-end h-100 position-relative">
              <img
                src={imgSrc}
                alt={product.name}
                className="img-fluid w-100 h-100"
                loading="lazy"
                style={{ objectFit: "contain" }}
              />
              {/* Icon circle — uses inline orange directly for reliability */}
              <div
                className="products-mini-icon rounded-circle"
                style={{ backgroundColor: COLOR.primary }}
              >
                <Link
                  to={`/product-details/${product.slug}`}
                  aria-label={`View details for ${product.name}`}
                >
                  <i className="fa fa-eye text-white" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="col-7">
            <div className="products-mini-content p-3">
              <span className="d-block mb-1 text-muted">
                {product.category?.name || "Product"}
              </span>
              <h2 className="h6 mb-2">{product.name}</h2>
              {displayOldPrice && (
                <del className="me-2 text-muted">{displayOldPrice}</del>
              )}
              {/* Price — inline orange for reliability */}
              <span style={{ color: COLOR.primaryText, fontWeight: 700 }}>
                {displayPrice}
              </span>
            </div>
          </div>
        </div>

        {/* ADD TO CART */}
        <div className="products-mini-add border p-3">
          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-primary w-100 rounded-pill"
            disabled={isAdding || isInCart}
            aria-label={
              isInCart
                ? `${product.name} is already in cart`
                : `Add ${product.name} to cart`
            }
          >
            {isAdding ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Adding…
              </>
            ) : isInCart ? (
              <>
                <i className="fas fa-check me-2" aria-hidden="true" />
                In Cart
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart me-2" aria-hidden="true" />
                Add To Cart
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
});
ProductCard.displayName = "ProductCard";

// ─── BestSellerPage ────────────────────────────────────────────────────────
const BestSellerPage = () => {
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addingId, setAddingId]     = useState(null);

  const { addToCart, isAuthenticated, cartItems } = useAuth();
  const navigate = useNavigate();

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchBestSeller = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(TOP_SELLING_URL);
      setBestSeller(res?.data?.products || []);
    } catch (err) {
      console.error("Best Seller fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSeller();
  }, [fetchBestSeller]);

  // ── Add to Cart ────────────────────────────────────────────────────────
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
        toast.error("Already added. Update quantity from cart.");
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

  // ── isInCart helper ────────────────────────────────────────────────────
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.product._id === productId),
    [cartItems]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    // Scoping class "bs-page" ensures our CSS overrides don't leak globally
    <div className="bs-page">
      <style>{GLOBAL_STYLES}</style>

      <HeroNavbar />
      <Toaster />

      {/* HEADER */}
      <div className="container-fluid page-header py-5 wow fadeInUp">
        <h1 className="text-center text-white display-6">
          Bestseller Products
        </h1>
      </div>

      <Services />
      <ProductOffer />

      {/* BEST SELLER GRID */}
      <div className="container-fluid products pt-5">
        <div className="container products-mini py-5">
          <div className="row g-4">

            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : bestSeller.length === 0 ? (
              <EmptyState onRetry={fetchBestSeller} />
            ) : (
              bestSeller.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdding={addingId === product._id}
                  isInCart={isInCart(product._id)}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}

          </div>
        </div>
      </div>

      {/* LAZY SECTIONS */}
      <Suspense fallback={<p className="text-center py-5">Loading products…</p>}>
        <OurProduct />
      </Suspense>

      <Suspense fallback={<p className="text-center py-5">Loading list…</p>}>
        <div className="container-fluid products productList py-5">
          <ProductList />
        </div>
      </Suspense>
    </div>
  );
};

export default BestSellerPage;