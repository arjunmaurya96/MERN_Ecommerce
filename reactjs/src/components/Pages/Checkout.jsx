import HeroNavbar from "./HeroNavbar";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/BaseUrl";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DummyPaymentModal from "../Payment/DummyPayment";
import {
  FaCreditCard,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCheck,
  FaUser,
  FaHome,
  FaCity,
  FaGlobe,
  FaMapPin,
  FaPhone,
  FaReceipt,
  FaClipboardList,
  FaShoppingBag,
  FaTruck,
  FaWallet,
  FaMoneyBillWave,
  FaSpinner,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";

/* ============================================================
   STYLES — scoped to .checkout-root so HeroNavbar is untouched
   Font Awesome 5 (fas) already loaded via index.html
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --co-primary       : #FF6B00;
    --co-primary-light : #FF8C38;
    --co-primary-dark  : #E05A00;
    --co-primary-bg    : #FFF4EC;
    --co-primary-glow  : rgba(255,107,0,0.18);
    --co-text-dark     : #1A1A2E;
    --co-text-muted    : #6B7280;
    --co-border        : #F0E0D6;
    --co-surface       : #FFFFFF;
    --co-surface-alt   : #FFF8F4;
    --co-shadow-sm     : 0 2px 8px rgba(255,107,0,0.08);
    --co-shadow-md     : 0 8px 32px rgba(255,107,0,0.12);
    --co-radius        : 16px;
    --co-radius-sm     : 10px;
    --co-radius-xs     : 6px;
  }

  /* Scoped to checkout only — navbar safe */
  .checkout-root,
  .checkout-root * {
    font-family: 'Poppins', sans-serif !important;
    box-sizing: border-box;
  }

  /* ---- PAGE HEADER ---- */
  .co-page-header {
    background: linear-gradient(135deg, var(--co-primary-dark) 0%, var(--co-primary) 50%, var(--co-primary-light) 100%);
    padding: 60px 0 52px;
    position: relative;
    overflow: hidden;
  }
  .co-page-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
    pointer-events: none;
  }
  .co-page-header::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -40px;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    pointer-events: none;
  }
  .co-page-header h1 {
    font-size: 1.9rem;
    font-weight: 700;
    position: relative; z-index: 1;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .co-breadcrumb {
    font-size: 0.82rem;
    opacity: 0.82;
    position: relative; z-index: 1;
    margin-top: 8px;
  }
  .co-breadcrumb a { color: #fff; text-decoration: none; }
  .co-breadcrumb a:hover { text-decoration: underline; }
  .co-breadcrumb .sep { opacity: 0.5; margin: 0 8px; }

  /* ---- PROGRESS STEPS ---- */
  .co-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 28px 0 0;
  }
  .co-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .co-step-circle {
    width: 38px; height: 38px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.88rem;
    font-weight: 700;
    transition: all 0.3s;
  }
  .co-step.done .co-step-circle   { background: var(--co-primary); color: #fff; box-shadow: 0 4px 12px var(--co-primary-glow); }
  .co-step.active .co-step-circle { background: #fff; color: var(--co-primary); border: 2px solid var(--co-primary); }
  .co-step.idle .co-step-circle   { background: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); border: 2px solid rgba(255,255,255,0.3); }
  .co-step-label { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.85); letter-spacing: 0.5px; }
  .co-step-line {
    width: 60px; height: 2px;
    background: rgba(255,255,255,0.25);
    margin-bottom: 22px;
  }

  /* ---- WRAPPER ---- */
  .co-wrapper {
    background: #F9F4F0;
    min-height: 70vh;
    padding: 48px 0 80px;
  }

  /* ---- SECTION TITLE ---- */
  .co-section-title {
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--co-primary); margin-bottom: 18px;
    display: flex; align-items: center; gap: 7px;
  }

  /* ---- BILLING CARD ---- */
  .co-card {
    background: var(--co-surface);
    border-radius: var(--co-radius);
    border: 1px solid var(--co-border);
    box-shadow: var(--co-shadow-sm);
    padding: 28px 28px 24px;
    margin-bottom: 20px;
  }
  .co-card-title {
    font-size: 1.05rem; font-weight: 700;
    color: var(--co-text-dark); margin-bottom: 22px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid var(--co-border);
    display: flex; align-items: center; gap: 10px;
  }
  .co-card-title i { color: var(--co-primary); font-size: 1rem; }

  /* ---- FORM ---- */
  .co-form-group { margin-bottom: 18px; }
  .co-label {
    display: block;
    font-size: 0.76rem; font-weight: 600;
    color: var(--co-text-muted);
    letter-spacing: 0.5px; text-transform: uppercase;
    margin-bottom: 7px;
  }
  .co-label .req { color: var(--co-primary); margin-left: 2px; }

  .co-input,
  .co-textarea {
    width: 100%;
    border: 1.5px solid var(--co-border);
    border-radius: var(--co-radius-xs);
    padding: 11px 14px;
    font-size: 0.88rem;
    font-family: 'Poppins', sans-serif;
    color: var(--co-text-dark);
    background: var(--co-surface);
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .co-input:focus,
  .co-textarea:focus {
    border-color: var(--co-primary);
    box-shadow: 0 0 0 3px var(--co-primary-glow);
  }
  .co-input::placeholder,
  .co-textarea::placeholder { color: #C4B5AC; }
  .co-textarea { resize: vertical; min-height: 100px; }

  .co-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 480px) { .co-row-2 { grid-template-columns: 1fr; } }

  /* ---- INPUT ICON WRAP ---- */
  .co-input-icon { position: relative; }
  .co-input-icon i {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--co-primary); font-size: 0.8rem;
    pointer-events: none;
  }
  .co-input-icon .co-input { padding-left: 36px; }

  /* ---- ORDER SUMMARY CARD ---- */
  .co-summary-card {
    background: var(--co-surface);
    border-radius: var(--co-radius);
    border: 1px solid var(--co-border);
    box-shadow: var(--co-shadow-md);
    overflow: hidden;
    position: sticky;
    top: 24px;
  }
  .co-summary-header {
    background: linear-gradient(135deg, var(--co-primary-dark), var(--co-primary));
    padding: 18px 22px;
    display: flex; align-items: center; gap: 10px;
  }
  .co-summary-header h2 {
    color: #fff; font-size: 1rem; font-weight: 700; margin: 0;
  }
  .co-summary-header i { color: rgba(255,255,255,0.85); font-size: 1rem; }

  /* ---- ORDER TABLE ---- */
  .co-order-table { width: 100%; border-collapse: collapse; }
  .co-order-table thead tr {
    background: var(--co-surface-alt);
    border-bottom: 1.5px solid var(--co-border);
  }
  .co-order-table thead th {
    font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.2px;
    color: var(--co-text-muted); padding: 12px 16px; border: none;
  }
  .co-order-table thead th:last-child { text-align: right; }
  .co-order-table tbody tr { border-bottom: 1px solid #FDF0E8; }
  .co-order-table tbody tr:last-child { border-bottom: none; }
  .co-order-table tbody td {
    padding: 13px 16px; border: none;
    font-size: 0.84rem; color: var(--co-text-dark);
    vertical-align: middle;
  }
  .co-order-table tbody td:last-child { text-align: right; font-weight: 600; }
  .co-product-name { font-weight: 600; font-size: 0.84rem; color: var(--co-text-dark); margin: 0; }
  .co-product-price { font-size: 0.75rem; color: var(--co-primary); margin: 2px 0 0; }
  .co-qty-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--co-primary-bg); color: var(--co-primary);
    font-size: 0.78rem; font-weight: 700;
    border: 1px solid rgba(255,107,0,0.2);
  }

  /* ---- SUMMARY TOTALS ---- */
  .co-totals { padding: 16px 16px 0; }
  .co-total-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 8px 0;
    border-bottom: 1px dashed var(--co-border);
  }
  .co-total-row:last-of-type { border-bottom: none; }
  .co-total-label { font-size: 0.83rem; color: var(--co-text-muted); font-weight: 500; }
  .co-total-value { font-size: 0.88rem; font-weight: 600; color: var(--co-text-dark); }
  .co-grand-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 16px; background: var(--co-primary-bg);
    border-top: 2px solid var(--co-border);
    margin-top: 4px;
  }
  .co-grand-label { font-size: 0.95rem; font-weight: 700; color: var(--co-text-dark); }
  .co-grand-value { font-size: 1.25rem; font-weight: 800; color: var(--co-primary); }

  /* ---- PAYMENT METHOD ---- */
  .co-payment-options { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
  .co-payment-option {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    border: 2px solid var(--co-border);
    border-radius: var(--co-radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    background: var(--co-surface);
  }
  .co-payment-option.selected {
    border-color: var(--co-primary);
    background: var(--co-primary-bg);
    box-shadow: 0 0 0 3px var(--co-primary-glow);
  }
  .co-payment-option:hover { border-color: var(--co-primary-light); }
  .co-payment-icon {
    width: 40px; height: 40px; border-radius: var(--co-radius-xs);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
  }
  .co-payment-icon.cod   { background: #FFF4EC; color: var(--co-primary); }
  .co-payment-icon.online { background: #EFF6FF; color: #3B82F6; }
  .co-payment-info .co-pay-title { font-size: 0.88rem; font-weight: 600; color: var(--co-text-dark); margin: 0; }
  .co-payment-info .co-pay-sub   { font-size: 0.74rem; color: var(--co-text-muted); margin: 2px 0 0; }
  .co-radio-dot {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid var(--co-border); margin-left: auto;
    flex-shrink: 0; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .co-payment-option.selected .co-radio-dot {
    border-color: var(--co-primary);
    background: var(--co-primary);
  }
  .co-radio-dot::after {
    content: '';
    width: 6px; height: 6px; border-radius: 50%; background: #fff;
  }

  /* ---- PLACE ORDER BTN ---- */
  .co-place-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    background: linear-gradient(135deg, var(--co-primary-dark) 0%, var(--co-primary) 60%, var(--co-primary-light) 100%);
    color: #fff; border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 0.92rem; font-weight: 700; letter-spacing: 0.5px;
    text-transform: uppercase; padding: 15px 24px;
    border-radius: 50px; width: calc(100% - 32px);
    margin: 16px 16px 8px;
    cursor: pointer;
    transition: all 0.3s; box-shadow: 0 6px 20px var(--co-primary-glow);
  }
  .co-place-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,107,0,0.3); }
  .co-place-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .co-secure-note {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 0.7rem; color: var(--co-text-muted);
    padding: 0 16px 16px; font-weight: 500;
  }
  .co-secure-note i { color: #22C55E; }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 991px) {
    .co-summary-card { position: static; margin-top: 24px; }
  }
  @media (max-width: 768px) {
    .co-page-header { padding: 40px 0 36px; }
    .co-page-header h1 { font-size: 1.5rem; }
    .co-card { padding: 20px 16px; }
    .co-step-line { width: 36px; }
  }
`;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useAuth();
  const navigate = useNavigate();
  const SHIPPING_CHARGE = 3;

  const [billing, setBilling] = useState({
    firstName: "", address: "", city: "",
    country: "", zip: "", mobile: "", notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setBilling({ ...billing, [e.target.name]: e.target.value });

  const placeOrder = async (paymentStatus) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        `${BASE_URL}/api/order/order-place`,
        { billingAddress: billing, paymentMethod, paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully 🎉");
      clearCart();
      navigate(`/order-success/${res.data.order._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!billing.firstName || !billing.address || !billing.city ||
        !billing.country || !billing.zip || !billing.mobile) {
      toast.error("Please fill all required billing details");
      return;
    }
    if (cartItems.length === 0) { toast.error("Your cart is empty"); return; }
    if (paymentMethod === "COD") { setLoading(true); placeOrder("PENDING"); }
    else { setShowPayment(true); }
  };

  return (
    <>
      <style>{styles}</style>
      <HeroNavbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "'Poppins', sans-serif", fontSize: "0.84rem", fontWeight: 500 },
          success: { iconTheme: { primary: "#FF6B00", secondary: "#fff" } },
        }}
      />

      {/* ===== PAGE HEADER ===== */}
      <div className="co-page-header text-center">
        <h1 className="text-white">
         <FaCreditCard />
          Checkout
        </h1>
        <div className="co-breadcrumb">
          <a href="/">Home</a>
          <span className="sep">›</span>
          <a href="/cart">Cart</a>
          <span className="sep">›</span>
          <span style={{ color: "#fff" }}>Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="co-steps">
          <div className="co-step done">
            <div className="co-step-circle"><FaShoppingCart /></div>
            <span className="co-step-label">Cart</span>
          </div>
          <div className="co-step-line"></div>
          <div className="co-step active">
            <div className="co-step-circle"><FaMapMarkerAlt /></div>
            <span className="co-step-label">Details</span>
          </div>
          <div className="co-step-line"></div>
          <div className="co-step idle">
            <div className="co-step-circle"><FaCheck /></div>
            <span className="co-step-label">Confirm</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div className="co-wrapper">
        <div className="container checkout-root">
          <div className="row g-4 align-items-start">

            {/* ===== LEFT: BILLING ===== */}
            <div className="col-12 col-lg-7">

              {/* Billing Card */}
              <div className="co-card">
                <div className="co-card-title">
                <FaMapMarkerAlt />
                  Billing Details
                </div>

                {/* Full Name */}
                <div className="co-form-group">
                  <label className="co-label">Full Name <span className="req">*</span></label>
                  <div className="co-input-icon">
                   <FaUser />
                    <input
                      name="firstName"
                      className="co-input"
                      placeholder="Enter your full name"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="co-form-group">
                  <label className="co-label">Street Address <span className="req">*</span></label>
                  <div className="co-input-icon">
                  <FaHome />
                    <input
                      name="address"
                      className="co-input"
                      placeholder="House no, Street, Area"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* City + Country */}
                <div className="co-row-2">
                  <div className="co-form-group">
                    <label className="co-label">City <span className="req">*</span></label>
                    <div className="co-input-icon">
                    <FaCity />
                      <input name="city" className="co-input" placeholder="City" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="co-form-group">
                    <label className="co-label">Country <span className="req">*</span></label>
                    <div className="co-input-icon">
                     <FaGlobe />
                      <input name="country" className="co-input" placeholder="Country" onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* ZIP + Mobile */}
                <div className="co-row-2">
                  <div className="co-form-group">
                    <label className="co-label">PIN / ZIP <span className="req">*</span></label>
                    <div className="co-input-icon">
                     <FaMapPin />
                      <input name="zip" className="co-input" placeholder="PIN Code" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="co-form-group">
                    <label className="co-label">Mobile <span className="req">*</span></label>
                    <div className="co-input-icon">
                   <FaPhone />
                      <input name="mobile" className="co-input" placeholder="10-digit number" onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="co-form-group" style={{ marginBottom: 0 }}>
                  <label className="co-label">Order Notes <span style={{ color: "#aaa", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    name="notes"
                    className="co-textarea"
                    placeholder="Any special instructions for delivery..."
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            {/* ===== RIGHT: SUMMARY + PAYMENT ===== */}
            <div className="col-12 col-lg-5">

              <div className="co-section-title">
               <FaReceipt /> Order Summary
              </div>

              <div className="co-summary-card">

                {/* Header */}
                <div className="co-summary-header">
                 <FaClipboardList />
                  <h2>Your Order ({cartItems.length} items)</h2>
                </div>

                {/* Product List */}
                <div style={{ overflowX: "auto" }}>
                  <table className="co-order-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <p className="co-product-name">{item.product?.name}</p>
                            <p className="co-product-price">₹{item.price} / unit</p>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className="co-qty-badge">{item.qty}</span>
                          </td>
                          <td>₹{item.price * item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="co-totals">
                  <div className="co-total-row">
                    <span className="co-total-label"><FaShoppingBag className="me-2" style={{ color: "var(--co-primary)", fontSize: "0.75rem" }} />Subtotal</span>
                    <span className="co-total-value">₹{cartTotal}</span>
                  </div>
                  <div className="co-total-row">
                    <span className="co-total-label"><FaTruck className="me-2" style={{ color: "var(--co-primary)", fontSize: "0.75rem" }} />Shipping</span>
                    <span className="co-total-value">₹{SHIPPING_CHARGE}</span>
                  </div>
                </div>

                <div className="co-grand-row">
                  <span className="co-grand-label">Grand Total</span>
                  <span className="co-grand-value">₹{cartTotal + SHIPPING_CHARGE}</span>
                </div>

                {/* Payment Method */}
                <div style={{ padding: "16px 16px 0", borderTop: "1.5px solid var(--co-border)", marginTop: "4px" }}>
                  <div className="co-section-title" style={{ marginBottom: "12px" }}>
                   <FaWallet />Payment Method
                  </div>
                </div>

                <div className="co-payment-options">
                  {/* COD */}
                  <div
                    className={`co-payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <div className="co-payment-icon cod">
                     <FaMoneyBillWave />
                    </div>
                    <div className="co-payment-info">
                      <p className="co-pay-title">Cash on Delivery</p>
                      <p className="co-pay-sub">Pay when your order arrives</p>
                    </div>
                    <div className="co-radio-dot"></div>
                  </div>

                  {/* Online */}
                  <div
                    className={`co-payment-option ${paymentMethod === "ONLINE" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("ONLINE")}
                  >
                    <div className="co-payment-icon online">
                      <FaCreditCard />
                    </div>
                    <div className="co-payment-info">
                      <p className="co-pay-title">Pay Online</p>
                      <p className="co-pay-sub">Card / UPI / Net Banking</p>
                    </div>
                    <div className="co-radio-dot"></div>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  className="co-place-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading
                    ? <><FaSpinner className="spin-icon" />Placing Order...</>
                    : <><FaCheckCircle /> Place Order</>
                  }
                </button>

                <div className="co-secure-note">
                 <FaLock />
                  Your payment info is secure &amp; encrypted
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===== DUMMY PAYMENT MODAL ===== */}
      {showPayment && (
        <DummyPaymentModal
          amount={cartTotal + SHIPPING_CHARGE}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            setLoading(true);
            placeOrder("PAID");
          }}
        />
      )}
    </>
  );
};

export default Checkout;