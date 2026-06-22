import React, { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/BaseUrl";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   CONSTANTS (outside component)
───────────────────────────────────────── */
const FALLBACK_IMG   = "/img/no-image.png";
const ORDERS_URL     = `${BASE_URL}/api/dashboard/user/my-orders`;
const DELETE_URL     = (id) => `${BASE_URL}/api/dashboard/user/order/delete/${id}`;

const STATUS_MAP = {
  DELIVERED: { color: "#16a34a", bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.2)"  },
  SHIPPED:   { color: "#2563eb", bg: "rgba(37,99,235,0.08)",   border: "rgba(37,99,235,0.2)"  },
  CONFIRMED: { color: "#0891b2", bg: "rgba(8,145,178,0.08)",   border: "rgba(8,145,178,0.2)"  },
  PLACED:    { color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)"  },
  CANCELLED: { color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.2)"  },
};
const DEFAULT_STATUS = { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" };

/* ─────────────────────────────────────────
   CLOUDINARY IMAGE RESOLVER
───────────────────────────────────────── */
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

const getProductImage = (product) =>
  getImageUrl(product?.images?.[0]);

const getToken = () => localStorage.getItem("userToken");

/* ─────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────── */
const css = `
  .muo {
    --o      : #FF6B1A;
    --o-lt   : #FF8C42;
    --o-pale : rgba(255,107,26,0.08);
    --o-bdr  : rgba(255,107,26,0.22);
    --black  : #111111;
    --ink    : #222222;
    --ink2   : #555555;
    --ink3   : #888888;
    --rule   : #E9E9E9;
    --bg     : #F7F7F5;
    --white  : #FFFFFF;
    background: var(--bg);
    min-height: 100vh;
    padding: 2.5rem 2rem;
    color: var(--ink);
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  .muo *, .muo *::before, .muo *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── SKELETON ── */
  .muo-skel-card {
    background: var(--white);
    border: 1px solid var(--rule);
    border-radius: 18px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex; gap: 1rem; align-items: center;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  }
  .muo-skel {
    background: linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%);
    background-size: 200% 100%;
    animation: muo-shimmer 1.4s infinite;
    border-radius: 8px;
  }
  .muo-skel-img  { width: 76px; height: 76px; border-radius: 12px; flex-shrink: 0; }
  .muo-skel-body { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .muo-skel-line { height: 12px; }
  @keyframes muo-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── HEADER ── */
  .muo-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 0.75rem; margin-bottom: 2.25rem;
    animation: muo-up 0.5s ease both;
  }
  .muo-eyebrow {
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--o); margin-bottom: 0.45rem;
  }
  .muo-eyebrow-line { display: block; width: 24px; height: 2px; background: var(--o); border-radius: 2px; }
  .muo-header h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 900; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--black);
  }
  .muo-header h1 em { font-style: normal; color: var(--o); }
  .muo-header p { margin-top: 0.4rem; font-size: 0.88rem; color: var(--ink3); }
  .muo-count-pill {
    background: var(--o-pale); border: 1px solid var(--o-bdr);
    color: var(--o); font-size: 0.75rem; font-weight: 700;
    padding: 0.4rem 1rem; border-radius: 100px; white-space: nowrap;
  }

  /* ── DIVIDER ── */
  .muo-divider { border: none; border-top: 1px solid var(--rule); margin: 0 0 2rem; }

  /* ── ERROR BANNER ── */
  .muo-error-banner {
    display: flex; align-items: center; gap: 12px;
    background: rgba(220,38,38,0.06);
    border: 1.5px solid rgba(220,38,38,0.2);
    border-radius: 12px; padding: 14px 18px;
    margin-bottom: 1.5rem; font-size: 0.84rem;
    color: #dc2626; font-weight: 500;
  }
  .muo-error-banner button {
    margin-left: auto; padding: 6px 16px;
    border-radius: 8px; border: 1.5px solid rgba(220,38,38,0.3);
    background: #fff; color: #dc2626;
    font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
    white-space: nowrap;
  }
  .muo-error-banner button:hover { background: rgba(220,38,38,0.06); }

  /* ── EMPTY STATE ── */
  .muo-empty {
    background: var(--white); border: 1px dashed var(--rule);
    border-radius: 20px; padding: 4rem 2rem;
    text-align: center; animation: muo-up 0.5s ease 0.1s both;
  }
  .muo-empty-icon {
    width: 64px; height: 64px; border-radius: 18px;
    background: var(--o-pale);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem; color: var(--o);
  }
  .muo-empty h2 { font-size: 1.3rem; font-weight: 700; color: var(--black); margin-bottom: 0.5rem; }
  .muo-empty p  { font-size: 0.88rem; color: var(--ink3); }

  /* ── ORDER CARD ── */
  .muo-card {
    background: var(--white); border: 1px solid var(--rule);
    border-radius: 18px; margin-bottom: 1.1rem;
    overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.04);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    animation: muo-up 0.5s ease both;
  }
  .muo-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(0,0,0,0.08);
    border-color: var(--o-bdr);
  }
  .muo-card-stripe { height: 3px; background: linear-gradient(90deg, var(--o), var(--o-lt), transparent); }
  .muo-card-body {
    padding: 1.4rem 1.5rem;
    display: flex; align-items: center;
    gap: 1.25rem; flex-wrap: wrap;
  }

  /* ── IMAGE ── */
  .muo-img-wrap {
    width: 76px; height: 76px;
    border-radius: 12px; overflow: hidden;
    border: 1px solid var(--rule); flex-shrink: 0;
    background: var(--bg);
  }
  .muo-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* ── INFO ── */
  .muo-info { flex: 1; min-width: 160px; }
  .muo-product-name {
    font-size: 0.97rem; font-weight: 700; color: var(--black);
    margin-bottom: 0.3rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .muo-extra-items {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: var(--o-pale); border: 1px solid var(--o-bdr);
    color: var(--o); font-size: 0.7rem; font-weight: 600;
    padding: 0.15rem 0.55rem; border-radius: 100px; margin-bottom: 0.35rem;
  }
  .muo-order-id {
    font-size: 0.75rem; color: var(--ink3);
    font-family: monospace; letter-spacing: 0.03em;
    margin-bottom: 0.2rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .muo-order-date { font-size: 0.78rem; color: var(--ink3); }

  /* ── STATUS + PRICE ── */
  .muo-meta { display: flex; flex-direction: column; gap: 0.5rem; min-width: 110px; }
  .muo-status-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.71rem; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    padding: 0.3rem 0.75rem; border-radius: 100px;
    border: 1px solid transparent; width: fit-content;
  }
  .muo-status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .muo-price {
    font-size: 1.2rem; font-weight: 700;
    color: var(--black); letter-spacing: -0.01em;
  }

  /* ── ACTIONS ── */
  .muo-actions { display: flex; flex-direction: column; gap: 0.55rem; min-width: 130px; }
  .muo-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    font-size: 0.78rem; font-weight: 600;
    padding: 0.5rem 1rem; border-radius: 10px;
    border: 1px solid transparent;
    cursor: pointer; transition: all 0.18s ease;
    white-space: nowrap; text-decoration: none; background: none;
    font-family: 'Poppins', sans-serif;
  }
  .muo-btn:disabled { opacity: 0.55; cursor: not-allowed; pointer-events: none; }

  .muo-btn-view {
    background: var(--o); color: #fff; border-color: var(--o);
    box-shadow: 0 3px 10px rgba(255,107,26,0.25);
  }
  .muo-btn-view:hover:not(:disabled) {
    background: var(--o-lt); border-color: var(--o-lt);
    box-shadow: 0 5px 16px rgba(255,107,26,0.35); transform: translateY(-1px);
  }
  .muo-btn-invoice {
    background: var(--white); color: var(--ink2); border-color: var(--rule);
  }
  .muo-btn-invoice:hover:not(:disabled) {
    border-color: #ccc; color: var(--ink); background: var(--bg);
  }
  .muo-btn-delete {
    background: rgba(220,38,38,0.06); color: #dc2626;
    border-color: rgba(220,38,38,0.2);
  }
  .muo-btn-delete:hover:not(:disabled) {
    background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.35);
  }

  /* ── CONFIRM DIALOG ── */
  .muo-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; animation: muo-fade 0.15s ease;
  }
  .muo-dialog {
    background: #fff; border-radius: 20px;
    padding: 32px 28px; max-width: 380px; width: 90%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    animation: muo-up 0.2s ease;
  }
  .muo-dialog-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(220,38,38,0.08); color: #dc2626;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 1.3rem;
  }
  .muo-dialog h3 { font-size: 1rem; font-weight: 700; color: #111; margin-bottom: 8px; }
  .muo-dialog p  { font-size: 0.83rem; color: #777; margin-bottom: 22px; line-height: 1.6; }
  .muo-dialog-actions { display: flex; gap: 10px; justify-content: center; }
  .muo-dialog-cancel {
    padding: 9px 22px; border-radius: 50px;
    border: 1.5px solid #e5e5e5; background: #fff;
    color: #333; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .muo-dialog-cancel:hover { background: #f5f5f5; }
  .muo-dialog-confirm {
    padding: 9px 22px; border-radius: 50px; border: none;
    background: #dc2626; color: #fff;
    font-size: 0.82rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s, transform 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .muo-dialog-confirm:hover { background: #b91c1c; transform: translateY(-1px); }

  /* ── KEYFRAMES ── */
  @keyframes muo-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes muo-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes muo-rotate { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 639px) {
    .muo { padding: 1.5rem 1rem; }
    .muo-card-body { gap: 1rem; }
    .muo-actions { flex-direction: row; flex-wrap: wrap; min-width: unset; width: 100%; }
    .muo-actions .muo-btn { flex: 1; min-width: 80px; }
    .muo-meta { flex-direction: row; align-items: center; gap: 0.75rem; }
  }
  @media (max-width: 399px) {
    .muo-img-wrap { width: 60px; height: 60px; }
  }
`;

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/* ── Skeleton ── */
const SkeletonLoader = memo(() => (
  <>
    {[1, 2, 3].map((i) => (
      <div className="muo-skel-card" key={i}>
        <div className="muo-skel muo-skel-img" />
        <div className="muo-skel-body">
          <div className="muo-skel muo-skel-line" style={{ width: "55%" }} />
          <div className="muo-skel muo-skel-line" style={{ width: "35%" }} />
          <div className="muo-skel muo-skel-line" style={{ width: "45%" }} />
        </div>
      </div>
    ))}
  </>
));
SkeletonLoader.displayName = "SkeletonLoader";

/* ── ConfirmDialog ── */
const ConfirmDialog = memo(({ orderShort, onConfirm, onCancel }) => (
  <div
    className="muo-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="del-title"
  >
    <div className="muo-dialog">
      <div className="muo-dialog-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </div>
      <h3 id="del-title">Delete this order?</h3>
      <p>
        Order <strong>#{orderShort}</strong> will be permanently removed.<br />
        This action cannot be undone.
      </p>
      <div className="muo-dialog-actions">
        <button className="muo-dialog-cancel" onClick={onCancel}>Keep It</button>
        <button className="muo-dialog-confirm" onClick={onConfirm}>Yes, Delete</button>
      </div>
    </div>
  </div>
));
ConfirmDialog.displayName = "ConfirmDialog";

/* ── SVG Icons (inline, no FA dependency) ── */
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconInvoice = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    style={{ animation: "muo-rotate 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconShop = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <line x1="3" x2="21" y1="6" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const MyUserOrder = () => {
  const navigate = useNavigate();

  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // order object awaiting confirm

  /* ── Fetch ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await axios.get(ORDERS_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("MyUserOrder fetch error:", err);
      setFetchError("Could not load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── Delete: step 1 — open dialog ── */
  const handleDeleteRequest = useCallback((order) => {
    setPendingDelete(order);
  }, []);

  /* ── Delete: step 2a — confirmed ── */
  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;
    const orderId = pendingDelete._id;
    setPendingDelete(null);
    setDeletingId(orderId);
    try {
      await axios.delete(DELETE_URL(orderId), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // Update local state — no re-fetch
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Delete order error:", err);
      setFetchError("Failed to delete order. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }, [pendingDelete]);

  /* ── Delete: step 2b — cancelled ── */
  const handleDeleteCancel = useCallback(() => {
    setPendingDelete(null);
  }, []);

  /* ── Navigate to details ── */
  const handleViewDetails = useCallback(
    (orderId) => navigate(`/user/order-details/${orderId}`),
    [navigate]
  );

  /* ── Status helper ── */
  const getStatusMeta = useCallback(
    (status) => STATUS_MAP[status] || DEFAULT_STATUS,
    []
  );

  /* ── Render ── */
  return (
    <>
      <style>{css}</style>

      {/* Confirm delete dialog */}
      {pendingDelete && (
        <ConfirmDialog
          orderShort={pendingDelete._id.slice(-8).toUpperCase()}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <div className="muo">

        {/* HEADER */}
        <div className="muo-header">
          <div>
            <div className="muo-eyebrow">
              <span className="muo-eyebrow-line" aria-hidden="true" />
              Account
            </div>
            <h1>My <em>Orders</em></h1>
            <p>View and manage your recent orders</p>
          </div>
          {!loading && orders.length > 0 && (
            <div className="muo-count-pill" aria-live="polite">
              {orders.length} Order{orders.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <hr className="muo-divider" />

        {/* ERROR BANNER */}
        {fetchError && (
          <div className="muo-error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {fetchError}
            <button onClick={fetchOrders}>Try Again</button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <SkeletonLoader />
        ) : orders.length === 0 && !fetchError ? (
          /* EMPTY STATE */
          <div className="muo-empty" role="status">
            <div className="muo-empty-icon"><IconShop /></div>
            <h2>No Orders Yet</h2>
            <p>Start shopping to see your orders here.</p>
          </div>
        ) : (
          /* ORDER CARDS */
          orders.map((order, idx) => {
            const firstItem  = order.items?.[0];
            const extraItems = order.items?.length - 1;
            const statusMeta = getStatusMeta(order.orderStatus);
            const isDeleting = deletingId === order._id;
            const canDelete  = order.orderStatus !== "DELIVERED";
            const priceStr   = `₹${Number(order.totalAmount).toLocaleString("en-IN")}`;

            return (
              <article
                className="muo-card"
                key={order._id}
                style={{ animationDelay: `${idx * 0.07}s` }}
                aria-label={`Order #${order._id.slice(-8).toUpperCase()}, status: ${order.orderStatus}`}
              >
                <div className="muo-card-stripe" aria-hidden="true" />

                <div className="muo-card-body">

                  {/* IMAGE */}
                  <div className="muo-img-wrap">
                    <img
                      src={getProductImage(firstItem?.product)}
                      alt={firstItem?.product?.name || "Product"}
                      loading="lazy"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="muo-info">
                    <div className="muo-product-name">
                      {firstItem?.product?.name || "—"}
                    </div>

                    {extraItems > 0 && (
                      <div className="muo-extra-items">
                        +{extraItems} more item{extraItems > 1 ? "s" : ""}
                      </div>
                    )}

                    <div className="muo-order-id" title={order._id}>
                      #{order._id}
                    </div>
                    <div className="muo-order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* STATUS + PRICE */}
                  <div className="muo-meta">
                    <div
                      className="muo-status-badge"
                      style={{
                        color: statusMeta.color,
                        background: statusMeta.bg,
                        borderColor: statusMeta.border,
                      }}
                    >
                      <span
                        className="muo-status-dot"
                        style={{ background: statusMeta.color }}
                        aria-hidden="true"
                      />
                      {order.orderStatus}
                    </div>
                    <div className="muo-price">{priceStr}</div>
                  </div>

                  {/* ACTIONS */}
                  <div className="muo-actions">

                    <button
                      className="muo-btn muo-btn-view"
                      onClick={() => handleViewDetails(order._id)}
                      aria-label={`View details for order #${order._id.slice(-8).toUpperCase()}`}
                    >
                      <IconEye /> View Details
                    </button>

                    <button
                      className="muo-btn muo-btn-invoice"
                      aria-label={`Download invoice for order #${order._id.slice(-8).toUpperCase()}`}
                    >
                      <IconInvoice /> Invoice
                    </button>

                    {canDelete && (
                      <button
                        className="muo-btn muo-btn-delete"
                        disabled={isDeleting}
                        onClick={() => handleDeleteRequest(order)}
                        aria-label={`Delete order #${order._id.slice(-8).toUpperCase()}`}
                        aria-busy={isDeleting}
                      >
                        {isDeleting ? (
                          <><IconSpinner /> Deleting…</>
                        ) : (
                          <><IconTrash /> Delete</>
                        )}
                      </button>
                    )}

                  </div>
                </div>
              </article>
            );
          })
        )}

      </div>
    </>
  );
};

export default MyUserOrder;