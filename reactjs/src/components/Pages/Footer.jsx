import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const customerLinks = [
    "Contact Us", "Returns", "Order History",
    "Site Map", "Testimonials", "My Account", "Unsubscribe Notification",
  ];
  const infoLinks = [
    "About Us", "Delivery Information", "Privacy Policy",
    "Terms & Conditions", "Warranty", "FAQ", "Seller Login",
  ];
  const extraLinks = [
    "Brands", "Gift Vouchers", "Affiliates",
    "Wishlist", "Order History", "Track Your Order",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap');

        :root {
          --f-primary: #FF6B00;
          --f-primary-dark: #E05A00;
          --f-primary-glow: rgba(255,107,0,0.15);
          --f-bg: #0F1117;
          --f-bg2: #161B26;
          --f-card: #1A2030;
          --f-border: rgba(255,255,255,0.07);
          --f-text: rgba(255,255,255,0.55);
          --f-white: #FFFFFF;
        }

        .ef * { box-sizing: border-box; }
        .ef { font-family: 'Outfit', sans-serif; }

        /* ===== FOOTER MAIN ===== */
        .ef-footer {
          background: var(--f-bg);
          padding: 0;
          position: relative;
          overflow: hidden;
        }
        .ef-footer::before {
          content: '';
          position: absolute;
          top: -120px; left: -120px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .ef-footer::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ===== INFO STRIP ===== */
        .ef-strip {
          background: var(--f-bg2);
          border-bottom: 1px solid var(--f-border);
          padding: 36px 0;
        }
        .ef-strip-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }
        .ef-info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 28px;
          border-right: 1px solid var(--f-border);
        }
        .ef-info-card:first-child { padding-left: 0; }
        .ef-info-card:last-child { border-right: none; }
        .ef-info-icon {
          width: 52px; height: 52px; flex-shrink: 0;
          border-radius: 14px;
          background: var(--f-primary-glow);
          border: 1px solid rgba(255,107,0,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          color: var(--f-primary);
        }
        .ef-info-label {
          font-size: 11px; font-weight: 700;
          color: var(--f-primary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .ef-info-value {
          font-size: 14px; font-weight: 500;
          color: var(--f-white);
          line-height: 1.3;
        }

        /* ===== MAIN CONTENT ===== */
        .ef-main {
          max-width: 1280px; margin: 0 auto; padding: 64px 24px 48px;
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
          gap: 40px;
          position: relative; z-index: 1;
        }

        /* Brand column */
        .ef-brand-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 20px;
        }
        .ef-brand-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, var(--f-primary), var(--f-primary-dark));
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(255,107,0,0.3);
          flex-shrink: 0;
        }
        .ef-brand-icon svg { width: 20px; height: 20px; fill: white; }
        .ef-brand-name {
          font-family: 'Space Mono', monospace;
          font-size: 20px; font-weight: 700;
          color: var(--f-white);
          letter-spacing: -0.5px;
        }
        .ef-brand-name span { color: var(--f-primary); }
        .ef-brand-desc {
          font-size: 13.5px; line-height: 1.7;
          color: var(--f-text);
          margin-bottom: 24px;
        }

        /* Newsletter */
        .ef-newsletter-label {
          font-size: 11px; font-weight: 700;
          color: var(--f-primary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .ef-newsletter-form {
          display: flex;
          border: 1.5px solid var(--f-border);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
          margin-bottom: 24px;
        }
        .ef-newsletter-form:focus-within { border-color: rgba(255,107,0,0.5); }
        .ef-newsletter-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--f-white); font-family: 'Outfit', sans-serif;
          font-size: 13.5px; padding: 12px 14px;
        }
        .ef-newsletter-input::placeholder { color: rgba(255,255,255,0.3); }
        .ef-newsletter-btn {
          background: var(--f-primary); border: none;
          color: white; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 0 18px; cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ef-newsletter-btn:hover { background: var(--f-primary-dark); }

        /* Social */
        .ef-social { display: flex; gap: 8px; }
        .ef-social-btn {
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1px solid var(--f-border);
          background: transparent;
          color: var(--f-text);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .ef-social-btn:hover {
          border-color: var(--f-primary);
          color: var(--f-primary);
          background: var(--f-primary-glow);
        }

        /* Link columns */
        .ef-col-title {
          font-size: 13px; font-weight: 700;
          color: var(--f-white);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--f-border);
          position: relative;
        }
        .ef-col-title::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 32px; height: 2px;
          background: var(--f-primary);
          border-radius: 2px;
        }
        .ef-links { list-style: none; margin: 0; padding: 0; }
        .ef-links li { margin-bottom: 10px; }
        .ef-links a {
          color: var(--f-text);
          text-decoration: none;
          font-size: 13.5px; font-weight: 400;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.18s;
        }
        .ef-links a .ef-link-dot {
          width: 5px; height: 5px;
          background: rgba(255,107,0,0.4);
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.18s;
        }
        .ef-links a:hover { color: var(--f-white); padding-left: 4px; }
        .ef-links a:hover .ef-link-dot { background: var(--f-primary); transform: scale(1.4); }

        /* ===== PAYMENT STRIP ===== */
        .ef-payment-strip {
          border-top: 1px solid var(--f-border);
          padding: 24px 0;
          position: relative; z-index: 1;
        }
        .ef-payment-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        .ef-payment-label {
          font-size: 11px; font-weight: 700;
          color: var(--f-text);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .ef-payment-icons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ef-payment-pill {
          background: var(--f-card);
          border: 1px solid var(--f-border);
          border-radius: 7px;
          padding: 5px 12px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.02em;
        }
        .ef-trust { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .ef-trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 12.5px; color: var(--f-text);
        }
        .ef-trust-item i { color: var(--f-primary); font-size: 14px; }

        /* ===== COPYRIGHT ===== */
        .ef-copyright {
          background: #0A0D14;
          padding: 18px 0;
          border-top: 1px solid rgba(255,107,0,0.1);
        }
        .ef-copyright-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }
        .ef-copyright-text {
          font-size: 12.5px; color: rgba(255,255,255,0.35);
        }
        .ef-copyright-text span { color: var(--f-primary); font-weight: 600; }
        .ef-copyright-credit {
          font-size: 12.5px; color: rgba(255,255,255,0.35);
        }
        .ef-copyright-credit a {
          color: var(--f-primary); text-decoration: none; font-weight: 600;
        }
        .ef-copyright-credit a:hover { text-decoration: underline; }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .ef-strip-inner { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .ef-info-card { border-right: none; padding: 0; }
          .ef-main { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 640px) {
          .ef-strip-inner { grid-template-columns: 1fr; gap: 20px; }
          .ef-main { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px 32px; }
          .ef-main > div:first-child { padding-bottom: 8px; border-bottom: 1px solid var(--f-border); }
          .ef-payment-inner { flex-direction: column; align-items: flex-start; }
          .ef-copyright-inner { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="ef ef-footer">

        {/* ===== INFO STRIP ===== */}
        <div className="ef-strip">
          <div className="ef-strip-inner">

            <div className="ef-info-card">
              <div className="ef-info-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div>
                <div className="ef-info-label">Address</div>
                <div className="ef-info-value">UP Prayagraj </div>
              </div>
            </div>

            <div className="ef-info-card">
              <div className="ef-info-icon"><i className="fas fa-envelope"></i></div>
              <div>
                <div className="ef-info-label">Email Us</div>
                <div className="ef-info-value">arjundeveloper123@gmail.com</div>
              </div>
            </div>

            <div className="ef-info-card">
              <div className="ef-info-icon"><i className="fas fa-phone-alt"></i></div>
              <div>
                <div className="ef-info-label">Call Us</div>
                <div className="ef-info-value">91: 9621192312</div>
              </div>
            </div>

            <div className="ef-info-card">
              <div className="ef-info-icon"><i className="fas fa-clock"></i></div>
              <div>
                <div className="ef-info-label">Working Hours</div>
                <div className="ef-info-value">Mon–Sat, 9am–6pm</div>
              </div>
            </div>

          </div>
        </div>

        {/* ===== MAIN LINKS ===== */}
        <div className="ef-main">

          {/* Brand + Newsletter */}
          <div>
            <a href="/" className="ef-brand-logo">
              <div className="ef-brand-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="ef-brand-name">Electro<span>.</span></div>
            </a>
            <p className="ef-brand-desc">
              Your one-stop destination for the latest electronics. From mobiles to smart home devices — unbeatable prices, genuine products.
            </p>

            <div className="ef-newsletter-label">Stay Updated</div>
            <div className="ef-newsletter-form">
              <input
                type="email"
                className="ef-newsletter-input"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="ef-newsletter-btn">Subscribe</button>
            </div>

            <div className="ef-social">
              <a href="#" className="ef-social-btn"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="ef-social-btn"><i className="fab fa-instagram"></i></a>
              <a href="#" className="ef-social-btn"><i className="fab fa-twitter"></i></a>
              <a href="#" className="ef-social-btn"><i className="fab fa-youtube"></i></a>
              <a href="#" className="ef-social-btn"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <div className="ef-col-title">Customer Service</div>
            <ul className="ef-links">
              {customerLinks.map((item, i) => (
                <li key={i}>
                  <a href="#">
                    <span className="ef-link-dot"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <div className="ef-col-title">Information</div>
            <ul className="ef-links">
              {infoLinks.map((item, i) => (
                <li key={i}>
                  <a href="#">
                    <span className="ef-link-dot"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Extras */}
          <div>
            <div className="ef-col-title">Quick Links</div>
            <ul className="ef-links">
              {extraLinks.map((item, i) => (
                <li key={i}>
                  <a href="#">
                    <span className="ef-link-dot"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ===== PAYMENT + TRUST ===== */}
        <div className="ef-payment-strip">
          <div className="ef-payment-inner">

            <div>
              <div className="ef-payment-label">We Accept</div>
              <div className="ef-payment-icons">
                {["Visa", "Mastercard", "UPI", "Paytm", "PhonePe", "Net Banking", "COD"].map((p, i) => (
                  <span key={i} className="ef-payment-pill">{p}</span>
                ))}
              </div>
            </div>

            <div className="ef-trust">
              <div className="ef-trust-item">
                <i className="fas fa-shield-alt"></i>
                <span>100% Secure</span>
              </div>
              <div className="ef-trust-item">
                <i className="fas fa-undo"></i>
                <span>Easy Returns</span>
              </div>
              <div className="ef-trust-item">
                <i className="fas fa-truck"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="ef-trust-item">
                <i className="fas fa-headset"></i>
                <span>24/7 Support</span>
              </div>
            </div>

          </div>
        </div>

      </footer>

      {/* ===== COPYRIGHT ===== */}
      <div className="ef ef-copyright">
        <div className="ef-copyright-inner">
          <div className="ef-copyright-text">
            © {new Date().getFullYear()} <span>Coderlife.</span> All rights reserved.
          </div>
          <div className="ef-copyright-credit">
            Designed by <a href="#">Arjun Web Developer</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;