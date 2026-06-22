import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const accountRef = useRef(null);
  const langRef = useRef(null);

  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <Toaster position="top-right" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap');

        :root {
          --o-primary: #FF6B00;
          --o-primary-dark: #E05A00;
          --o-primary-light: #FF8C35;
          --o-primary-glow: rgba(255,107,0,0.18);
          --o-dark: #111827;
          --o-dark2: #1F2937;
          --o-border: #E5E7EB;
          --o-text: #1F2937;
          --o-muted: #6B7280;
          --o-bg: #FFFFFF;
          --o-surface: #F9FAFB;
          --o-radius: 10px;
        }

        .enb * { box-sizing: border-box; }
        .enb { font-family: 'Outfit', sans-serif; }

        /* ===================== TOP BAR ===================== */
        .enb-topbar {
          background: var(--o-dark);
          padding: 7px 0;
          font-size: 12.5px;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.02em;
        }
        .enb-topbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
        }
        .enb-topbar-left { display: flex; align-items: center; gap: 6px; }
        .enb-topbar-pill {
          background: rgba(255,107,0,0.15);
          border: 1px solid rgba(255,107,0,0.3);
          color: var(--o-primary-light);
          font-size: 11.5px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.03em;
        }
        .enb-topbar-right { display: flex; align-items: center; gap: 6px; }
        .enb-topbar-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s;
          display: flex; align-items: center; gap: 5px;
        }
        .enb-topbar-link:hover { color: var(--o-primary-light); background: rgba(255,107,0,0.1); }
        .enb-topbar-sep { color: rgba(255,255,255,0.15); font-size: 10px; }

        /* Custom Dropdown */
        .enb-dropdown { position: relative; }
        .enb-dropdown-trigger {
          color: rgba(255,255,255,0.5);
          background: transparent;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 5px;
          display: flex; align-items: center; gap: 5px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .enb-dropdown-trigger:hover { color: var(--o-primary-light); background: rgba(255,107,0,0.1); }
        .enb-dropdown-trigger .enb-chevron {
          font-size: 9px;
          transition: transform 0.2s;
          display: inline-block;
        }
        .enb-dropdown-trigger.open .enb-chevron { transform: rotate(180deg); }
        .enb-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--o-bg);
          border: 1px solid var(--o-border);
          border-radius: var(--o-radius);
          min-width: 200px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
          z-index: 9999;
          overflow: hidden;
          animation: enbDropIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes enbDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .enb-dropdown-menu-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px;
          color: var(--o-text);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: 'Outfit', sans-serif;
        }
        .enb-dropdown-menu-item:hover { background: var(--o-surface); color: var(--o-primary); }
        .enb-dropdown-menu-item.danger { color: #DC2626; }
        .enb-dropdown-menu-item.danger:hover { background: #FEF2F2; color: #DC2626; }
        .enb-dropdown-divider { border: none; border-top: 1px solid var(--o-border); margin: 4px 0; }
        .enb-dropdown-header {
          padding: 10px 16px 6px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--o-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ===================== MIDDLE BAR ===================== */
        .enb-middle {
          background: var(--o-bg);
          border-bottom: 1px solid var(--o-border);
          padding: 16px 0;
        }
        .enb-middle-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
        }

        /* Logo */
        .enb-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .enb-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, var(--o-primary), var(--o-primary-dark));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px var(--o-primary-glow);
          flex-shrink: 0;
        }
        .enb-logo-icon svg { width: 22px; height: 22px; fill: white; }
        .enb-logo-text { line-height: 1; }
        .enb-logo-brand {
          font-family: 'Space Mono', monospace;
          font-size: 20px;
          font-weight: 700;
          color: var(--o-dark);
          letter-spacing: -0.5px;
        }
        .enb-logo-brand span { color: var(--o-primary); }
        .enb-logo-sub {
          font-size: 9.5px;
          font-weight: 600;
          color: var(--o-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* Search */
        .enb-search {
          position: relative;
          display: flex;
          align-items: center;
        }
        .enb-search-wrap {
          display: flex;
          width: 100%;
          border: 2px solid var(--o-border);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: var(--o-bg);
        }
        .enb-search-wrap.focused {
          border-color: var(--o-primary);
          box-shadow: 0 0 0 4px var(--o-primary-glow);
        }
        .enb-search-icon {
          padding: 0 14px;
          display: flex; align-items: center;
          background: var(--o-bg);
          color: var(--o-muted);
          font-size: 15px;
          flex-shrink: 0;
        }
        .enb-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-family: 'Outfit', sans-serif;
          font-size: 14.5px;
          color: var(--o-text);
          background: transparent;
          padding: 13px 0;
        }
        .enb-search-input::placeholder { color: var(--o-muted); }
        .enb-search-btn {
          background: var(--o-primary);
          border: none;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 0 24px;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.02em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .enb-search-btn:hover { background: var(--o-primary-dark); }

        /* Right Actions */
        .enb-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .enb-icon-btn {
          position: relative;
          width: 44px; height: 44px;
          border-radius: 10px;
          border: 1.5px solid var(--o-border);
          background: var(--o-bg);
          display: flex; align-items: center; justify-content: center;
          color: var(--o-text);
          text-decoration: none;
          font-size: 18px;
          transition: all 0.2s;
          cursor: pointer;
          flex-shrink: 0;
        }
        .enb-icon-btn:hover {
          border-color: var(--o-primary);
          color: var(--o-primary);
          background: var(--o-primary-glow);
        }
        .enb-cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: var(--o-primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px; height: 18px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
          font-family: 'Space Mono', monospace;
          animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .enb-btn-login {
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px; font-weight: 600;
          color: var(--o-primary);
          background: transparent;
          border: 1.5px solid var(--o-primary);
          border-radius: 10px;
          padding: 9px 18px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center;
        }
        .enb-btn-login:hover { background: var(--o-primary-glow); }
        .enb-btn-register {
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px; font-weight: 600;
          color: white;
          background: var(--o-primary);
          border: 1.5px solid var(--o-primary);
          border-radius: 10px;
          padding: 9px 18px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center;
        }
        .enb-btn-register:hover {
          background: var(--o-primary-dark);
          box-shadow: 0 4px 16px var(--o-primary-glow);
          transform: translateY(-1px);
        }
        .enb-btn-account {
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px; font-weight: 600;
          color: var(--o-primary);
          background: var(--o-primary-glow);
          border: 1.5px solid rgba(255,107,0,0.3);
          border-radius: 10px;
          padding: 9px 16px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex; align-items: center; gap: 8px;
        }
        .enb-btn-account:hover {
          background: var(--o-primary);
          color: white;
          border-color: var(--o-primary);
        }
        .enb-avatar {
          width: 26px; height: 26px;
          background: var(--o-primary);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: white;
          flex-shrink: 0;
        }
        .enb-btn-account:hover .enb-avatar { background: white; color: var(--o-primary); }

        /* ===================== MOBILE ===================== */
        .enb-mobile {
          background: var(--o-bg);
          border-bottom: 1px solid var(--o-border);
          display: none;
        }
        .enb-mobile-top {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .enb-mobile-search {
          padding: 0 16px 12px;
        }
        .enb-mobile-search-wrap {
          display: flex;
          border: 1.5px solid var(--o-border);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .enb-mobile-search-wrap:focus-within { border-color: var(--o-primary); }
        .enb-mobile-search-icon {
          padding: 0 12px;
          display: flex; align-items: center;
          color: var(--o-muted); font-size: 14px;
        }
        .enb-mobile-search-input {
          flex: 1; border: none; outline: none;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; padding: 11px 0;
          color: var(--o-text); background: transparent;
        }
        .enb-mobile-search-input::placeholder { color: var(--o-muted); }
        .enb-mobile-search-btn {
          background: var(--o-primary); border: none;
          color: white; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 0 16px; cursor: pointer;
        }

        /* ===================== RESPONSIVE ===================== */
        @media (max-width: 1023px) {
          .enb-desktop { display: none !important; }
          .enb-mobile { display: block; }
        }
        @media (min-width: 1024px) {
          .enb-desktop { display: block; }
          .enb-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .enb-logo-brand { font-size: 17px; }
          .enb-logo-sub { display: none; }
        }
      `}</style>

      {/* ===================== DESKTOP ===================== */}
      <div className="enb enb-desktop">

        {/* TOP BAR */}
        <div className="enb-topbar">
          <div className="enb-topbar-inner">
            <div className="enb-topbar-left">
              <span className="enb-topbar-pill">⚡ SALE</span>
              <span>Free shipping on orders over <strong style={{ color: "var(--o-primary-light)" }}>₹999</strong></span>
            </div>
            <div className="enb-topbar-right">
              <a href="#" className="enb-topbar-link">
                <i className="fas fa-question-circle" style={{ fontSize: 11 }}></i> Help
              </a>
              <span className="enb-topbar-sep">•</span>
              <a href="#" className="enb-topbar-link">
                <i className="fas fa-headset" style={{ fontSize: 11 }}></i> Support
              </a>
              <span className="enb-topbar-sep">•</span>
              <a href="/contact-us" className="enb-topbar-link">
                <i className="fas fa-envelope" style={{ fontSize: 11 }}></i> Contact
              </a>
              <span className="enb-topbar-sep">•</span>

              {/* Language */}
              <div className="enb-dropdown" ref={langRef}>
                <button
                  className={`enb-dropdown-trigger ${langOpen ? "open" : ""}`}
                  onClick={() => { setLangOpen(!langOpen); setAccountOpen(false); }}
                >
                  <i className="fas fa-globe" style={{ fontSize: 11 }}></i>
                  English
                  <span className="enb-chevron">▼</span>
                </button>
                {langOpen && (
                  <div className="enb-dropdown-menu" style={{ minWidth: 140 }}>
                    <button className="enb-dropdown-menu-item">🇺🇸 English</button>
                    <button className="enb-dropdown-menu-item">🇮🇳 Hindi</button>
                  </div>
                )}
              </div>

              <span className="enb-topbar-sep">•</span>

              {/* Account */}
              <div className="enb-dropdown" ref={accountRef}>
                <button
                  className={`enb-dropdown-trigger ${accountOpen ? "open" : ""}`}
                  onClick={() => { setAccountOpen(!accountOpen); setLangOpen(false); }}
                >
                  <i className="bi bi-person" style={{ fontSize: 12 }}></i>
                  My Account
                  <span className="enb-chevron">▼</span>
                </button>
                {accountOpen && (
                  <div className="enb-dropdown-menu">
                    <div className="enb-dropdown-header">Admin</div>
                    {adminToken ? (
                      <Link to="/admin" className="enb-dropdown-menu-item" onClick={() => setAccountOpen(false)}>
                        <i className="bi bi-shield-lock" style={{ color: "#DC2626" }}></i> Admin Dashboard
                      </Link>
                    ) : (
                      <Link to="/admin/login" className="enb-dropdown-menu-item" onClick={() => setAccountOpen(false)}>
                        <i className="bi bi-shield-lock" style={{ color: "#DC2626" }}></i> Admin Login
                      </Link>
                    )}
                    <hr className="enb-dropdown-divider" />
                    <div className="enb-dropdown-header">User</div>
                    {userToken ? (
                      <>
                        <Link to="/user/dashboard" className="enb-dropdown-menu-item" onClick={() => setAccountOpen(false)}>
                          <i className="bi bi-person-circle" style={{ color: "var(--o-primary)" }}></i> Dashboard
                        </Link>
                        <button className="enb-dropdown-menu-item danger" onClick={() => { handleLogout(); setAccountOpen(false); }}>
                          <i className="bi bi-box-arrow-right"></i> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="enb-dropdown-menu-item" onClick={() => setAccountOpen(false)}>
                          <i className="bi bi-box-arrow-in-right" style={{ color: "var(--o-primary)" }}></i> Login
                        </Link>
                        <Link to="/register" className="enb-dropdown-menu-item" onClick={() => setAccountOpen(false)}>
                          <i className="bi bi-person-plus" style={{ color: "#16A34A" }}></i> Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE BAR */}
        <div className="enb-middle">
          <div className="enb-middle-inner">

            {/* Logo */}
            <Link to="/" className="enb-logo">
              <div className="enb-logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="enb-logo-text">
                <div className="enb-logo-brand">Electro<span>.</span></div>
                <div className="enb-logo-sub">Electronics Store</div>
              </div>
            </Link>

            {/* Search */}
            <div className="enb-search">
              <div className={`enb-search-wrap ${searchFocused ? "focused" : ""}`}>
                <div className="enb-search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  className="enb-search-input"
                  placeholder="Search for mobiles, laptops, TVs..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <button className="enb-search-btn">Search</button>
              </div>
            </div>

            {/* Actions */}
            <div className="enb-actions">
              <Link to="/wishlist" className="enb-icon-btn" title="Wishlist">
                <i className="far fa-heart"></i>
              </Link>

              <Link to="/cart" className="enb-icon-btn" title="Cart">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span className="enb-cart-badge">{cartCount}</span>
                )}
              </Link>

              {userToken ? (
                <Link to="/user/dashboard" className="enb-btn-account">
                  <div className="enb-avatar"><i className="fas fa-user" style={{ fontSize: 11 }}></i></div>
                  My Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="enb-btn-login">Login</Link>
                  <Link to="/register" className="enb-btn-register">Register</Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="enb enb-mobile">
        <div className="enb-mobile-top">

          {/* Logo */}
          <Link to="/" className="enb-logo">
            <div className="enb-logo-icon" style={{ width: 36, height: 36, borderRadius: 9 }}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18, fill: "white" }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="enb-logo-text">
              <div className="enb-logo-brand" style={{ fontSize: 17 }}>Electro<span style={{ color: "var(--o-primary)" }}>.</span></div>
            </div>
          </Link>

          {/* Right Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link to="/wishlist" className="enb-icon-btn" style={{ width: 38, height: 38, fontSize: 16 }}>
              <i className="far fa-heart"></i>
            </Link>
            <Link to="/cart" className="enb-icon-btn" style={{ width: 38, height: 38, fontSize: 16 }}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="enb-cart-badge">{cartCount}</span>}
            </Link>
            {userToken ? (
              <Link to="/user/dashboard" className="enb-btn-account" style={{ padding: "7px 12px", fontSize: 13, borderRadius: 9 }}>
                <div className="enb-avatar" style={{ width: 22, height: 22, fontSize: 10 }}>
                  <i className="fas fa-user"></i>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="enb-btn-register" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 9 }}>
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="enb-mobile-search">
          <div className="enb-mobile-search-wrap">
            <div className="enb-mobile-search-icon">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              className="enb-mobile-search-input"
              placeholder="Search products..."
            />
            <button className="enb-mobile-search-btn">Search</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;