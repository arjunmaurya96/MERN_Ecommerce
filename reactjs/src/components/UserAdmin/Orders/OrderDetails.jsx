import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../services/BaseUrl";
import toast from "react-hot-toast";

/* ─────────────── CONSTANTS (outside component) ─────────────── */
const STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const CANCELLABLE_STATUSES = ["PLACED", "CONFIRMED"];

const getImageUrl = (img) => {
  if (!img) return "/img/no-image.png";
  if (typeof img === "object" && img.url) return img.url;           // Cloudinary object
  if (typeof img === "string") {
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  }
  return "/img/no-image.png";
};

/* ─────────────── SCOPED CSS ─────────────── */
const css = `
  .od {
    --o:       #FF6B1A;
    --o-lt:    #FF8C42;
    --o-pale:  rgba(255,107,26,0.08);
    --o-bdr:   rgba(255,107,26,0.22);
    --black:   #0F0F0F;
    --ink:     #1E1E1E;
    --ink2:    #555555;
    --ink3:    #888888;
    --rule:    #EBEBEB;
    --bg:      #F6F6F4;
    --white:   #FFFFFF;
    --green:   #16a34a;
    --green-bg:rgba(22,163,74,0.08);
    --red:     #dc2626;
    --red-bg:  rgba(220,38,38,0.07);
    --shimmer-base: #e8e8e8;
    --shimmer-high: #f5f5f5;

    font-family: 'Poppins', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    padding: 2rem 2rem 3rem;
    color: var(--ink);
    box-sizing: border-box;
  }
  .od *, .od *::before, .od *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── SHIMMER SKELETON ── */
  @keyframes od-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .od-skeleton {
    background: linear-gradient(90deg, var(--shimmer-base) 25%, var(--shimmer-high) 50%, var(--shimmer-base) 75%);
    background-size: 600px 100%;
    animation: od-shimmer 1.4s ease infinite;
    border-radius: 8px;
  }
  .od-skeleton-header { height: 28px; width: 220px; margin-bottom: 0.6rem; }
  .od-skeleton-sub    { height: 14px; width: 160px; }
  .od-skeleton-card   { height: 140px; width: 100%; border-radius: 18px; margin-bottom: 1.25rem; }
  .od-skeleton-card-sm{ height: 220px; width: 100%; border-radius: 18px; margin-bottom: 1.25rem; }
  .od-skeleton-actions{ display:flex; gap:0.65rem; justify-content:flex-end; }
  .od-skeleton-btn    { height: 38px; width: 130px; border-radius: 10px; }

  /* ── EMPTY STATE ── */
  .od-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 1rem; text-align: center;
    padding: 2rem;
  }
  .od-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--o-pale);
    display: flex; align-items: center; justify-content: center;
  }
  .od-empty h2 { font-size: 1.1rem; font-weight: 700; color: var(--black); }
  .od-empty p  { font-size: 0.85rem; color: var(--ink3); max-width: 280px; }
  .od-empty-cta {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600;
    padding: 0.65rem 1.4rem; border-radius: 10px;
    background: var(--o); color: #fff;
    border: none; cursor: pointer;
    box-shadow: 0 3px 12px rgba(255,107,26,0.28);
    transition: all 0.18s ease;
  }
  .od-empty-cta:hover { background: var(--o-lt); transform: translateY(-1px); }

  /* ── HEADER ── */
  .od-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; flex-wrap: wrap;
    gap: 1rem; margin-bottom: 2rem;
    animation: od-up 0.45s ease both;
  }
  .od-eyebrow {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--o); margin-bottom: 0.4rem;
  }
  .od-eyebrow-line { width: 22px; height: 2px; background: var(--o); border-radius: 2px; }
  .od-header h1 {
    font-size: clamp(1.45rem, 3.5vw, 1.9rem);
    font-weight: 800; color: var(--black);
    letter-spacing: -0.02em; line-height: 1.1;
  }
  .od-header h1 em { font-style: normal; color: var(--o); }
  .od-order-id {
    font-size: 0.72rem; color: var(--ink3);
    font-family: monospace; margin-top: 0.3rem;
    letter-spacing: 0.04em;
  }
  .od-back-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.78rem; font-weight: 600;
    padding: 0.5rem 1.1rem; border-radius: 10px;
    border: 1px solid var(--rule);
    background: var(--white); color: var(--ink2);
    cursor: pointer; transition: all 0.18s ease;
    white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .od-back-btn:hover { border-color: #ccc; color: var(--ink); background: var(--bg); }
  .od-back-btn:focus-visible { outline: 2px solid var(--o); outline-offset: 2px; }

  /* ── DIVIDER ── */
  .od-divider { border: none; border-top: 1px solid var(--rule); margin: 0 0 1.75rem; }

  /* ── CARD BASE ── */
  .od-card {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 18px;
    margin-bottom: 1.25rem;
    overflow: hidden;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }
  .od-card-stripe {
    height: 3px;
    background: linear-gradient(90deg, var(--o), var(--o-lt), transparent);
  }
  .od-card-inner { padding: 1.5rem 1.6rem; }
  .od-card-title {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--ink3); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .od-card-title::after { content:''; flex:1; height:1px; background: var(--rule); }

  /* ── TRACKING ── */
  .od-track-wrap { padding: 0.25rem 0 0.5rem; }

  .od-cancelled-banner {
    display: flex; align-items: center; justify-content: center;
    gap: 0.6rem;
    background: var(--red-bg);
    border: 1px solid rgba(220,38,38,0.18);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: var(--red);
    font-weight: 600; font-size: 0.92rem;
  }

  .od-stepper {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    position: relative;
    padding: 0 0.5rem;
  }
  .od-stepper::before {
    content: '';
    position: absolute;
    top: 16px; left: calc(0.5rem + 16px);
    right: calc(0.5rem + 16px);
    height: 2px;
    background: var(--rule);
    z-index: 0;
  }
  .od-step {
    display: flex; flex-direction: column;
    align-items: center; gap: 0.55rem;
    flex: 1; position: relative; z-index: 1;
  }
  .od-step-dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--rule);
    background: var(--white);
    transition: all 0.3s ease;
    font-size: 0;
  }
  .od-step-dot.done {
    background: var(--green);
    border-color: var(--green);
    box-shadow: 0 0 0 4px rgba(22,163,74,0.12);
  }
  .od-step-dot.active {
    background: var(--o);
    border-color: var(--o);
    box-shadow: 0 0 0 5px var(--o-pale);
  }
  .od-step-dot svg { display: block; }
  .od-step-label {
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--ink3); text-align: center;
  }
  .od-step-label.done  { color: var(--green); }
  .od-step-label.active { color: var(--o); }

  .od-stepper-progress {
    position: absolute;
    top: 16px; left: calc(0.5rem + 16px);
    height: 2px;
    background: var(--green);
    z-index: 0;
    transition: width 0.6s ease;
  }

  /* ── ITEMS ── */
  .od-item {
    display: flex; align-items: center;
    gap: 1.1rem; padding: 1rem 0;
    border-bottom: 1px solid var(--rule);
  }
  .od-item:last-child { border-bottom: none; padding-bottom: 0; }
  .od-item:first-child { padding-top: 0; }

  .od-item-img {
    width: 72px; height: 72px; border-radius: 12px;
    overflow: hidden; flex-shrink: 0;
    border: 1px solid var(--rule); background: var(--bg);
  }
  .od-item-img img { width:100%; height:100%; object-fit:cover; display:block; }

  .od-item-info { flex: 1; min-width: 0; }
  .od-item-name {
    font-size: 0.9rem; font-weight: 600;
    color: var(--black); margin-bottom: 0.2rem;
  }
  .od-item-name.deleted { color: var(--ink3); font-style: italic; }
  .od-item-qty {
    font-size: 0.76rem; color: var(--ink3);
    font-weight: 500;
  }
  .od-item-price {
    font-size: 1rem; font-weight: 700;
    color: var(--black); white-space: nowrap;
    letter-spacing: -0.01em;
  }

  /* ── SUMMARY ROW ── */
  .od-summary {
    margin-top: 0.75rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--rule);
    display: flex; justify-content: flex-end;
    align-items: center; gap: 1rem;
  }
  .od-summary-label { font-size: 0.8rem; color: var(--ink3); font-weight: 500; }
  .od-summary-value {
    font-size: 1.25rem; font-weight: 800;
    color: var(--o); letter-spacing: -0.02em;
  }

  /* ── ACTIONS ── */
  .od-actions {
    display: flex; flex-wrap: wrap;
    gap: 0.65rem; justify-content: flex-end;
    animation: od-up 0.45s ease 0.35s both;
  }

  .od-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.78rem; font-weight: 600;
    padding: 0.6rem 1.25rem; border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer; transition: all 0.18s ease;
    white-space: nowrap; background: none;
  }
  .od-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .od-btn:focus-visible { outline: 2px solid var(--o); outline-offset: 2px; }

  .od-btn-cancel {
    background: var(--red-bg);
    color: var(--red);
    border-color: rgba(220,38,38,0.22);
  }
  .od-btn-cancel:hover:not(:disabled) {
    background: rgba(220,38,38,0.14);
    border-color: rgba(220,38,38,0.38);
    transform: translateY(-1px);
  }
  .od-btn-delete {
    background: var(--white);
    color: var(--red);
    border-color: rgba(220,38,38,0.22);
  }
  .od-btn-delete:hover:not(:disabled) {
    background: var(--red-bg);
    transform: translateY(-1px);
  }
  .od-btn-reorder {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  }
  .od-btn-reorder:hover:not(:disabled) {
    background: #2a2a2a;
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(0,0,0,0.22);
  }
  .od-btn-invoice {
    background: var(--o);
    color: #fff;
    border-color: var(--o);
    box-shadow: 0 3px 12px rgba(255,107,26,0.28);
  }
  .od-btn-invoice:hover:not(:disabled) {
    background: var(--o-lt);
    border-color: var(--o-lt);
    transform: translateY(-1px);
    box-shadow: 0 5px 18px rgba(255,107,26,0.38);
  }

  /* ── KEYFRAMES ── */
  @keyframes od-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes od-spin-small { to { transform: rotate(360deg); } }
  .od-btn-spin {
    animation: od-spin-small 0.75s linear infinite;
    display: inline-block;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 599px) {
    .od { padding: 1.5rem 1rem 2.5rem; }
    .od-card-inner { padding: 1.25rem; }
    .od-actions { justify-content: stretch; }
    .od-btn { flex: 1; justify-content: center; }
    .od-step-label { font-size: 0.6rem; }
    .od-step-dot { width: 26px; height: 26px; }
    .od-stepper::before { top: 13px; }
    .od-stepper-progress { top: 13px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .od-skeleton { animation: none; }
    .od-btn-spin  { animation: none; }
    .od-card, .od-header, .od-actions { animation: none; }
  }
`;

/* ─────────────── SUB-COMPONENTS ─────────────── */

const SkeletonLoader = React.memo(() => (
  <>
    <style>{css}</style>
    <div className="od">
      <div className="od-header">
        <div>
          <div className="od-skeleton od-skeleton-header" />
          <div className="od-skeleton od-skeleton-sub" style={{ marginTop: "0.4rem" }} />
        </div>
      </div>
      <hr className="od-divider" />
      <div className="od-skeleton od-skeleton-card" />
      <div className="od-skeleton od-skeleton-card-sm" />
      <div className="od-skeleton-actions">
        <div className="od-skeleton od-skeleton-btn" />
        <div className="od-skeleton od-skeleton-btn" />
      </div>
    </div>
  </>
));
SkeletonLoader.displayName = "SkeletonLoader";

const EmptyState = React.memo(({ onBack }) => (
  <>
    <style>{css}</style>
    <div className="od">
      <div className="od-empty">
        <div className="od-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#FF6B1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6M9 9l6 6" />
          </svg>
        </div>
        <h2>Order Not Found</h2>
        <p>We couldn't load this order. It may have been removed or the link is invalid.</p>
        <button className="od-empty-cta" onClick={onBack} aria-label="Go back to orders">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Orders
        </button>
      </div>
    </div>
  </>
));
EmptyState.displayName = "EmptyState";

const SpinnerIcon = React.memo(() => (
  <svg className="od-btn-spin" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
));
SpinnerIcon.displayName = "SpinnerIcon";

/* ─────────────── MAIN COMPONENT ─────────────── */
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `${BASE_URL}/api/dashboard/user/order/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data.order);
    } catch (err) {
      console.error("Failed to load order:", err);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  /* ================= ACTIONS ================= */
  const handleCancelOrder = useCallback(async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("userToken");
      await axios.put(
        `${BASE_URL}/api/dashboard/user/order/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order cancelled");
      fetchOrder();
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  }, [orderId, fetchOrder]);

  const handleDeleteOrder = useCallback(async () => {
    if (!window.confirm("Delete this cancelled order permanently?")) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${BASE_URL}/api/dashboard/user/order/delete/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order deleted");
      navigate("/user/orders");
    } catch (err) {
      console.error("Delete order error:", err);
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  }, [orderId, navigate]);

  const handleReOrder = useCallback(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    order.items.forEach((item) => {
      const existing = cart.find((c) => c.productId === item.product._id);
      if (existing) {
        existing.qty += item.qty;
      } else {
        cart.push({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: getImageUrl(item.product.images?.[0]),
          qty: item.qty,
        });
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Items added to cart");
    navigate("/cart");
  }, [order, navigate]);

  const handleDownloadInvoice = useCallback(async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `${BASE_URL}/api/dashboard/user/order/invoice/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded");
    } catch (err) {
      console.error("Invoice download error:", err);
      toast.error("Invoice download failed");
    }
  }, [orderId]);

  /* ================= HELPERS ================= */
  const isStepCompleted = useCallback(
    (step) => STEPS.indexOf(step) <= STEPS.indexOf(order?.orderStatus),
    [order?.orderStatus]
  );

  const isStepActive = useCallback(
    (step) => step === order?.orderStatus,
    [order?.orderStatus]
  );

  /* ================= LOADING SKELETON ================= */
  if (loading) return <SkeletonLoader />;

  /* ================= EMPTY STATE ================= */
  if (!order) return <EmptyState onBack={() => navigate("/user/orders")} />;

  /* stepper progress width */
  const currentIdx  = STEPS.indexOf(order.orderStatus);
  const progressPct = STEPS.length > 1
    ? (currentIdx / (STEPS.length - 1)) * 100
    : 0;

  /* ================= UI ================= */
  return (
    <>
      <style>{css}</style>
      <div className="od">

        {/* HEADER */}
        <div className="od-header">
          <div>
            <div className="od-eyebrow">
              <span className="od-eyebrow-line" />
              My Orders
            </div>
            <h1>Order <em>Details</em></h1>
            <div className="od-order-id">#{order._id}</div>
          </div>
          <button
            className="od-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>

        <hr className="od-divider" />

        {/* TRACKING CARD */}
        <div className="od-card" style={{ animation: "od-up 0.45s ease 0.05s both" }}>
          <div className="od-card-stripe" />
          <div className="od-card-inner">
            <div className="od-card-title">Order Status</div>

            {order.orderStatus === "CANCELLED" ? (
              <div className="od-cancelled-banner" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6M9 9l6 6" />
                </svg>
                This order has been cancelled
              </div>
            ) : (
              <div className="od-track-wrap">
                <div
                  className="od-stepper"
                  role="list"
                  aria-label="Order progress"
                >
                  {/* animated progress bar */}
                  <div
                    className="od-stepper-progress"
                    style={{ width: `calc(${progressPct}% * (100% - 64px) / 100)` }}
                    aria-hidden="true"
                  />

                  {STEPS.map((step) => {
                    const done   = isStepCompleted(step);
                    const active = isStepActive(step);
                    return (
                      <div
                        className="od-step"
                        key={step}
                        role="listitem"
                        aria-current={active ? "step" : undefined}
                      >
                        <div
                          className={`od-step-dot ${active ? "active" : done ? "done" : ""}`}
                          aria-label={`${step} – ${active ? "current" : done ? "completed" : "pending"}`}
                        >
                          {done && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="#fff" strokeWidth="2.8"
                              strokeLinecap="round" strokeLinejoin="round"
                              aria-hidden="true">
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          )}
                          {active && !done && (
                            <svg width="8" height="8" viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="12" cy="12" r="8" fill="#fff" />
                            </svg>
                          )}
                        </div>
                        <span className={`od-step-label ${active ? "active" : done ? "done" : ""}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ITEMS CARD */}
        <div className="od-card" style={{ animation: "od-up 0.45s ease 0.15s both" }}>
          <div className="od-card-stripe" />
          <div className="od-card-inner">
            <div className="od-card-title">
              Items ({order.items.length})
            </div>

            {order.items.map((item) => (
              <div className="od-item" key={item._id}>
                <div className="od-item-img">
                  <img
                    src={getImageUrl(item?.product?.images?.[0])}
                    alt={item?.product?.name || "Product"}
                    loading="lazy"
                  />
                </div>
                <div className="od-item-info">
                  <div className={`od-item-name${!item.product ? " deleted" : ""}`}>
                    {item.product ? item.product.name : "Product Deleted"}
                  </div>
                  <div className="od-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="od-item-price">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </div>
              </div>
            ))}

            <div className="od-summary">
              <span className="od-summary-label">Total Amount</span>
              <span className="od-summary-value">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="od-actions">
          {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
            <button
              className="od-btn od-btn-cancel"
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              aria-label="Cancel this order"
            >
              {cancelLoading ? (
                <>
                  <SpinnerIcon />
                  Cancelling…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6M9 9l6 6" />
                  </svg>
                  Cancel Order
                </>
              )}
            </button>
          )}

          {order.orderStatus === "CANCELLED" && (
            <button
              className="od-btn od-btn-delete"
              onClick={handleDeleteOrder}
              disabled={deleteLoading}
              aria-label="Delete this cancelled order permanently"
            >
              {deleteLoading ? (
                <>
                  <SpinnerIcon />
                  Deleting…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Delete Order
                </>
              )}
            </button>
          )}

          {order.orderStatus === "DELIVERED" && (
            <button
              className="od-btn od-btn-reorder"
              onClick={handleReOrder}
              aria-label="Re-order the same items"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              Re-Order
            </button>
          )}

          <button
            className="od-btn od-btn-invoice"
            onClick={handleDownloadInvoice}
            aria-label="Download invoice as PDF"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Download Invoice
          </button>
        </div>

      </div>
    </>
  );
};

export default OrderDetails;