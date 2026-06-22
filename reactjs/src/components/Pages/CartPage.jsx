import React, { useCallback, useState, memo } from "react";
import HeroNavbar from "./HeroNavbar";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../../services/BaseUrl";
import {
  FaShoppingCart,
  FaStore,
  FaTag,
  FaMinus,
  FaPlus,
  FaTimes,
  FaTicketAlt,
  FaReceipt,
  FaClipboardList,
  FaTruck,
  FaArrowRight,
  FaLock,
  FaTrashAlt,
} from "react-icons/fa";
import { AiFillAccountBook } from "react-icons/ai";

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  :root {
    --primary       : #FF6B00;
    --primary-light : #FF8C38;
    --primary-dark  : #E05A00;
    --primary-bg    : #FFF4EC;
    --primary-glow  : rgba(255,107,0,0.18);
    --text-dark     : #1A1A2E;
    --text-muted    : #6B7280;
    --border        : #F0E0D6;
    --surface       : #FFFFFF;
    --surface-alt   : #FFF8F4;
    --shadow-sm     : 0 2px 8px rgba(255,107,0,0.08);
    --shadow-md     : 0 8px 32px rgba(255,107,0,0.12);
    --radius        : 16px;
    --radius-sm     : 10px;
    --radius-xs     : 6px;
  }

  .cart-root * {
    font-family: 'Poppins', sans-serif !important;
    box-sizing: border-box;
  }

  /* ---- PAGE HEADER ---- */
  .cart-page-header {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
    padding: 60px 0 52px;
    position: relative;
    overflow: hidden;
  }
  .cart-page-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
    pointer-events: none;
  }
  .cart-page-header::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -40px;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    pointer-events: none;
  }
  .cart-page-header h1 {
    font-size: 1.9rem;
    font-weight: 700;
    position: relative; z-index: 1;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .cart-page-header h1 svg { font-size: 1.6rem; }
  .cart-breadcrumb {
    font-size: 0.82rem;
    opacity: 0.82;
    position: relative; z-index: 1;
    margin-top: 8px;
  }
  .cart-breadcrumb a { color: #fff; text-decoration: none; }
  .cart-breadcrumb a:hover { text-decoration: underline; }
  .cart-breadcrumb .sep { opacity: 0.5; margin: 0 8px; }

  /* ---- WRAPPER ---- */
  .cart-wrapper {
    background: #F9F4F0;
    min-height: 60vh;
    padding: 48px 0 80px;
  }

  /* ---- EMPTY STATE ---- */
  .cart-empty {
    text-align: center;
    padding: 80px 24px;
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
  }
  .cart-empty-icon {
    width: 90px; height: 90px;
    background: var(--primary-bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--primary);
    font-size: 2.2rem;
  }
  .cart-empty h4 { font-weight: 700; font-size: 1.2rem; color: var(--text-dark); margin-bottom: 8px; }
  .cart-empty p  { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 24px; }
  .btn-shop-now {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff; padding: 12px 32px; border-radius: 50px;
    text-decoration: none; font-weight: 600; font-size: 0.88rem;
    display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.3s; box-shadow: 0 4px 16px var(--primary-glow);
  }
  .btn-shop-now:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); color: #fff; }

  /* ---- SECTION LABEL ---- */
  .cart-section-title {
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--primary); margin-bottom: 14px;
    display: flex; align-items: center; gap: 7px;
  }

  /* ---- ITEM BADGE ---- */
  .item-count-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--primary-bg); color: var(--primary);
    font-size: 0.76rem; font-weight: 600;
    padding: 5px 14px; border-radius: 50px;
    border: 1px solid rgba(255,107,0,0.2);
    margin-bottom: 18px;
  }

  /* ---- TABLE CARD ---- */
  .cart-table-card {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .cart-table { margin: 0; width: 100%; }
  .cart-table thead tr {
    background: var(--surface-alt);
    border-bottom: 2px solid var(--border);
  }
  .cart-table thead th {
    font-size: 0.7rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--text-muted); padding: 15px 20px; border: none;
  }
  .cart-table tbody tr {
    border-bottom: 1px solid #FDF0E8;
    transition: background 0.2s;
  }
  .cart-table tbody tr:last-child { border-bottom: none; }
  .cart-table tbody tr:hover { background: #FFFAF7; }
  .cart-table tbody td {
    padding: 16px 20px; vertical-align: middle;
    border: none; font-size: 0.88rem; color: var(--text-dark);
  }

  /* ---- PRODUCT IMAGE ---- */
  .cart-img-wrap {
    width: 74px; height: 74px;
    background: var(--primary-bg);
    border-radius: var(--radius-sm);
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
  }
  .cart-img-wrap img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }

  /* ---- PRODUCT NAME ---- */
  .cart-product-name { font-weight: 600; font-size: 0.88rem; color: var(--text-dark); margin: 0; line-height: 1.4; }

  /* ---- PRICE ---- */
  .cart-price       { font-weight: 600; font-size: 0.92rem; color: var(--primary); }
  .cart-total-price { font-weight: 700; font-size: 0.96rem; color: var(--text-dark); }

  /* ---- QTY CONTROL ---- */
  .qty-control {
    display: inline-flex; align-items: center;
    background: var(--surface-alt);
    border: 1.5px solid var(--border);
    border-radius: 50px; padding: 3px; gap: 2px;
  }
  .qty-btn {
    width: 30px; height: 30px; border: none;
    background: var(--surface); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--primary); font-size: 0.72rem;
    transition: all 0.2s; box-shadow: var(--shadow-sm); flex-shrink: 0;
  }
  .qty-btn:hover { background: var(--primary); color: #fff; }
  .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .qty-btn:disabled:hover { background: var(--surface); color: var(--primary); }
  .qty-value {
    min-width: 32px; text-align: center;
    font-weight: 700; font-size: 0.86rem; color: var(--text-dark);
    border: none; background: transparent; outline: none;
  }

  /* ---- REMOVE BTN ---- */
  .remove-btn {
    width: 34px; height: 34px; border-radius: 9px;
    background: #FFF1F1; border: 1.5px solid #FFDDDD;
    color: #E53E3E; display: flex; align-items: center;
    justify-content: center; cursor: pointer; font-size: 0.78rem;
    transition: all 0.2s;
  }
  .remove-btn:hover { background: #E53E3E; color: #fff; border-color: #E53E3E; transform: scale(1.08); }

  /* ---- CONFIRM REMOVE OVERLAY ---- */
  .confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.15s ease;
  }
  .confirm-box {
    background: #fff; border-radius: 16px;
    padding: 32px 28px; max-width: 360px; width: 90%;
    text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  }
  .confirm-box .confirm-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: #FFF1F1; color: #E53E3E;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin: 0 auto 16px;
  }
  .confirm-box h3 { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; }
  .confirm-box p  { font-size: 0.83rem; color: var(--text-muted); margin-bottom: 22px; }
  .confirm-actions { display: flex; gap: 10px; justify-content: center; }
  .btn-confirm-cancel {
    padding: 9px 22px; border-radius: 50px; border: 1.5px solid var(--border);
    background: #fff; color: var(--text-dark); font-size: 0.82rem;
    font-weight: 600; cursor: pointer; transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .btn-confirm-cancel:hover { background: #f5f5f5; }
  .btn-confirm-remove {
    padding: 9px 22px; border-radius: 50px; border: none;
    background: #E53E3E; color: #fff; font-size: 0.82rem;
    font-weight: 600; cursor: pointer; transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .btn-confirm-remove:hover { background: #c53030; transform: translateY(-1px); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ---- COUPON STRIP ---- */
  .coupon-strip {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px dashed var(--primary-light);
    padding: 18px 22px;
    display: flex; align-items: center; gap: 12px;
    flex-wrap: wrap; margin-top: 22px;
  }
  .coupon-icon {
    width: 40px; height: 40px; background: var(--primary-bg);
    border-radius: var(--radius-xs); display: flex;
    align-items: center; justify-content: center;
    color: var(--primary); font-size: 1rem; flex-shrink: 0;
  }
  .coupon-input {
    flex: 1; min-width: 160px; border: none;
    background: transparent; outline: none;
    font-size: 0.88rem; font-family: 'Poppins', sans-serif;
    font-weight: 500; color: var(--text-dark);
  }
  .coupon-input::placeholder { color: #C4B5AC; font-weight: 400; }
  .btn-apply-coupon {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff; border: none; border-radius: 50px;
    padding: 9px 22px; font-size: 0.8rem; font-weight: 600;
    font-family: 'Poppins', sans-serif; cursor: pointer;
    transition: all 0.3s; box-shadow: 0 4px 12px var(--primary-glow); flex-shrink: 0;
  }
  .btn-apply-coupon:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }

  /* ---- ORDER SUMMARY CARD ---- */
  .order-summary-card {
    background: var(--surface); border-radius: var(--radius);
    border: 1px solid var(--border); box-shadow: var(--shadow-md);
    overflow: hidden; position: sticky; top: 24px;
  }
  .order-summary-header {
    background: linear-gradient(135deg, var(--primary-dark), var(--primary));
    padding: 20px 22px;
  }
  .order-summary-header .summary-heading {
    color: #fff; font-size: 1.05rem; font-weight: 700; margin: 0;
    display: flex; align-items: center; gap: 8px;
  }
  .order-summary-header p { color: rgba(255,255,255,0.75); font-size: 0.76rem; margin: 4px 0 0; }

  .order-summary-body { padding: 22px; }
  .summary-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 13px;
  }
  .summary-label {
    font-size: 0.83rem; color: var(--text-muted);
    font-weight: 500; display: flex; align-items: center; gap: 8px;
  }
  .summary-label svg { color: var(--primary); font-size: 0.8rem; width: 14px; }
  .summary-value { font-size: 0.88rem; font-weight: 600; color: var(--text-dark); }

  .summary-divider { border: none; border-top: 1.5px dashed var(--border); margin: 14px 0; }

  .summary-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 22px; background: var(--primary-bg);
    border-top: 2px solid var(--border);
  }
  .total-label { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); }
  .total-value { font-size: 1.25rem; font-weight: 800; color: var(--primary); }

  .btn-checkout {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, var(--primary-light) 100%);
    color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 0.88rem; font-weight: 700; letter-spacing: 0.5px;
    text-transform: uppercase; padding: 14px 22px;
    border-radius: 50px; text-decoration: none;
    transition: all 0.3s; box-shadow: 0 6px 20px var(--primary-glow);
    margin: 18px 22px 20px;
  }
  .btn-checkout:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,107,0,0.3); color: #fff; }

  .secure-badge {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 0.7rem; color: var(--text-muted);
    padding: 0 22px 16px; font-weight: 500;
  }
  .secure-badge svg { color: #22C55E; }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 768px) {
    .cart-table thead { display: none; }
    .cart-table tbody tr { display: flex; flex-wrap: wrap; padding: 14px; gap: 8px; }
    .cart-table tbody td { padding: 4px 0; }
    .cart-page-header { padding: 40px 0 34px; }
    .cart-page-header h1 { font-size: 1.5rem; }
    .coupon-strip { flex-direction: column; align-items: stretch; }
    .btn-apply-coupon { text-align: center; }
  }
`;

// ─── Constants ─────────────────────────────────────────────────────────────
const FALLBACK_IMG   = "/img/no-image.png";
const SHIPPING_CHARGE = 3;

// ─── Cloudinary-aware image resolver ──────────────────────────────────────
const getImageUrl = (img) => {
  if (!img) return FALLBACK_IMG;
  if (typeof img === "object" && img.url) return img.url;       // Cloudinary { url, public_id }
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/"))    return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return FALLBACK_IMG;
};

// ─── ConfirmDialog (replaces window.confirm) ──────────────────────────────
const ConfirmDialog = memo(({ productName, onConfirm, onCancel }) => (
  <div
    className="confirm-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
  >
    <div className="confirm-box">
      <div className="confirm-icon">
        <FaTrashAlt />
      </div>
      <h3 id="confirm-title">Remove Item?</h3>
      <p>
        <strong>{productName}</strong> will be removed from your cart.
      </p>
      <div className="confirm-actions">
        <button className="btn-confirm-cancel" onClick={onCancel}>
          Keep It
        </button>
        <button className="btn-confirm-remove" onClick={onConfirm}>
          Yes, Remove
        </button>
      </div>
    </div>
  </div>
));
ConfirmDialog.displayName = "ConfirmDialog";

// ─── CartRow ───────────────────────────────────────────────────────────────
const CartRow = memo(({ item, onDecrease, onIncrease, onRemove }) => {
  const imgSrc      = getImageUrl(item?.product?.images?.[0]);
  const unitPrice   = `₹${item.price?.toLocaleString("en-IN")}`;
  const totalPrice  = `₹${(item.price * item.qty)?.toLocaleString("en-IN")}`;

  return (
    <tr>
      {/* IMAGE */}
      <td>
        <div className="cart-img-wrap">
          <img src={imgSrc} alt={item?.product?.name || "Product"} loading="lazy" />
        </div>
      </td>

      {/* NAME */}
      <td>
        <p className="cart-product-name">{item?.product?.name}</p>
      </td>

      {/* UNIT PRICE */}
      <td>
        <span className="cart-price">{unitPrice}</span>
      </td>

      {/* QTY */}
      <td>
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => onDecrease(item)}
            disabled={item.qty <= 1}
            aria-label={`Decrease quantity of ${item?.product?.name}`}
          >
            <FaMinus />
          </button>
          <input
            type="text"
            className="qty-value"
            value={item.qty}
            readOnly
            aria-label="Quantity"
          />
          <button
            className="qty-btn"
            onClick={() => onIncrease(item)}
            aria-label={`Increase quantity of ${item?.product?.name}`}
          >
            <FaPlus />
          </button>
        </div>
      </td>

      {/* ROW TOTAL */}
      <td>
        <span className="cart-total-price">{totalPrice}</span>
      </td>

      {/* REMOVE */}
      <td>
        <button
          className="remove-btn"
          onClick={() => onRemove(item)}
          aria-label={`Remove ${item?.product?.name} from cart`}
        >
          <FaTimes />
        </button>
      </td>
    </tr>
  );
});
CartRow.displayName = "CartRow";

// ─── CartPage ──────────────────────────────────────────────────────────────
const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal, isAuthenticated } =
    useAuth();

  // Confirm dialog state — stores the item pending removal
  const [pendingRemove, setPendingRemove] = useState(null);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleDecrease = useCallback(
    (item) => {
      if (item.qty <= 1) {
        toast.error("Quantity cannot be less than 1");
        return;
      }
      updateQty({ productId: item.product?._id || item.product, qty: item.qty - 1 });
    },
    [updateQty]
  );

  const handleIncrease = useCallback(
    (item) => {
      updateQty({ productId: item.product?._id || item.product, qty: item.qty + 1 });
    },
    [updateQty]
  );

  // Step 1: open confirm dialog
  const handleRemoveRequest = useCallback((item) => {
    setPendingRemove(item);
  }, []);

  // Step 2a: confirmed → remove
  const handleRemoveConfirm = useCallback(() => {
    if (!pendingRemove) return;
    removeFromCart(pendingRemove.product?._id || pendingRemove.product);
    toast.success("Item removed from cart");
    setPendingRemove(null);
  }, [pendingRemove, removeFromCart]);

  // Step 2b: cancelled
  const handleRemoveCancel = useCallback(() => {
    setPendingRemove(null);
  }, []);

  /* ── Derived values ───────────────────────────────────────────────────── */
  const grandTotal      = (cartTotal + SHIPPING_CHARGE).toLocaleString("en-IN");
  const subtotalFormatted = cartTotal?.toLocaleString("en-IN");

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{styles}</style>

      <HeroNavbar />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.84rem",
            fontWeight: 500,
          },
          success: { iconTheme: { primary: "#FF6B00", secondary: "#fff" } },
        }}
      />

      {/* Confirm Dialog (toast-style, no window.confirm) */}
      {pendingRemove && (
        <ConfirmDialog
          productName={pendingRemove?.product?.name || "this item"}
          onConfirm={handleRemoveConfirm}
          onCancel={handleRemoveCancel}
        />
      )}

      {/* ===== PAGE HEADER ===== */}
      <div className="cart-page-header text-center">
        <h1 className="text-white">
          <FaShoppingCart aria-hidden="true" />
          My Cart
        </h1>
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">›</span>
          <span style={{ color: "#fff" }}>Shopping Cart</span>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="cart-wrapper">
        <div className="container cart-root">

          {cartItems.length === 0 ? (

            /* ===== EMPTY CART ===== */
            <div className="cart-empty">
              <div className="cart-empty-icon" aria-hidden="true">
                <FaShoppingCart />
              </div>
              <h4>Your cart is empty!</h4>
              <p>Looks like you haven't added anything yet. Start shopping!</p>
              <Link to="/" className="btn-shop-now">
                <FaStore aria-hidden="true" /> Browse Products
              </Link>
            </div>

          ) : (
            <div className="row g-4 align-items-start">

              {/* ===== LEFT: ITEMS ===== */}
              <div className="col-lg-8">

                <div className="cart-section-title">
                  <AiFillAccountBook aria-hidden="true" /> Your Items
                </div>

                <div className="item-count-badge">
                  <FaTag style={{ fontSize: "0.65rem" }} aria-hidden="true" />
                  {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in cart
                </div>

                {/* TABLE */}
                <div className="cart-table-card">
                  <div className="table-responsive">
                    <table className="cart-table table">
                      <thead>
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Name</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total</th>
                          <th scope="col"><span className="visually-hidden">Remove</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <CartRow
                            key={item._id}
                            item={item}
                            onDecrease={handleDecrease}
                            onIncrease={handleIncrease}
                            onRemove={handleRemoveRequest}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* COUPON */}
                <div className="coupon-strip">
                  <div className="coupon-icon" aria-hidden="true">
                    <FaTicketAlt />
                  </div>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code..."
                    aria-label="Coupon code"
                  />
                  <button className="btn-apply-coupon" type="button">
                    Apply
                  </button>
                </div>

              </div>

              {/* ===== RIGHT: ORDER SUMMARY ===== */}
              <div className="col-lg-4">

                <div className="cart-section-title">
                  <FaReceipt aria-hidden="true" /> Order Summary
                </div>

                <div className="order-summary-card">

                  <div className="order-summary-header">
                    {/* h2 → p.summary-heading to fix heading hierarchy */}
                    <p className="summary-heading">
                      <FaClipboardList aria-hidden="true" /> Price Details
                    </p>
                    <p>{cartItems.length} item{cartItems.length > 1 ? "s" : ""} selected</p>
                  </div>

                  <div className="order-summary-body">
                    <div className="summary-row">
                      <span className="summary-label">
                        <FaShoppingCart aria-hidden="true" /> Subtotal
                      </span>
                      <span className="summary-value">₹{subtotalFormatted}</span>
                    </div>

                    <div className="summary-row">
                      <span className="summary-label">
                        <FaTruck aria-hidden="true" /> Shipping
                      </span>
                      <span className="summary-value">
                        ₹{SHIPPING_CHARGE.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span className="summary-label">
                        <FaTag style={{ fontSize: "0.65rem" }} aria-hidden="true" /> Discount
                      </span>
                      <span className="summary-value" style={{ color: "#22C55E" }}>—</span>
                    </div>

                    <hr className="summary-divider" />
                  </div>

                  <div className="summary-total-row">
                    <span className="total-label">Grand Total</span>
                    <span className="total-value">₹{grandTotal}</span>
                  </div>

                  <Link
                    to={isAuthenticated ? "/checkout" : "/login"}
                    onClick={() => {
                      if (!isAuthenticated)
                        toast.error("Please login to continue checkout");
                    }}
                    className="btn-checkout"
                  >
                    Proceed to Checkout
                    <FaArrowRight aria-hidden="true" />
                  </Link>

                  <div className="secure-badge">
                    <FaLock aria-hidden="true" />
                    Secure &amp; Encrypted Checkout
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;