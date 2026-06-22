import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';

const HeroNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { userToken, logout, cartCount } = useAuth();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getMainAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:8080/api/category/get-main-category"
      );
      if (data.success) {
        setCategories(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMainAllCategory();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Toaster />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --primary: #FF6B00;
          --primary-dark: #E05A00;
          --primary-light: #FF8C35;
          --primary-glow: rgba(255, 107, 0, 0.25);
          --dark: #1A1A1A;
          --dark-2: #252525;
          --white: #FFFFFF;
          --off-white: #FFF8F3;
          --text-muted: #999;
        }

        * { box-sizing: border-box; }

        .enav-wrapper {
          position: relative;
          width: 100%;
          z-index: 1050;
          font-family: 'Outfit', sans-serif;
        }

        .enav-wrapper.sticky {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          animation: eNavSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes eNavSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* ---- TOP BAR ---- */
        .enav-topbar {
          background: var(--dark);
          padding: 6px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
        .enav-topbar span strong { color: var(--primary); }
        .enav-topbar-links a {
          color: var(--text-muted);
          text-decoration: none;
          margin-left: 18px;
          transition: color 0.2s;
        }
        .enav-topbar-links a:hover { color: var(--primary); }

        /* ---- MAIN BAR ---- */
        .enav-main {
          background: var(--dark-2);
          border-bottom: 2px solid var(--primary);
          padding: 0 40px;
          display: flex;
          align-items: stretch;
          min-height: 64px;
          position: relative;
        }

        /* ---- LOGO ---- */
        .enav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          margin-right: 32px;
          flex-shrink: 0;
        }
        .enav-logo-text {
          font-family: 'Space Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.5px;
        }
        .enav-logo-text span {
          color: var(--primary);
        }
        .enav-logo-dot {
          width: 7px;
          height: 7px;
          background: var(--primary);
          border-radius: 50%;
          margin-left: 4px;
          display: inline-block;
          animation: logoPulse 2s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }

        /* ---- CATEGORY TRIGGER ---- */
        .enav-cat-trigger {
          background: var(--primary);
          border: none;
          color: var(--white);
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
          letter-spacing: 0.02em;
          position: relative;
          flex-shrink: 0;
        }
        .enav-cat-trigger:hover { background: var(--primary-dark); }
        .enav-cat-trigger .cat-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .enav-cat-trigger .cat-icon span {
          display: block;
          width: 18px;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: transform 0.3s;
        }
        .enav-cat-trigger.open .cat-icon span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .enav-cat-trigger.open .cat-icon span:nth-child(2) { opacity: 0; }
        .enav-cat-trigger.open .cat-icon span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ---- CATEGORY DROPDOWN ---- */
        .enav-cat-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 240px;
          background: var(--white);
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          z-index: 2000;
          border-top: 3px solid var(--primary);
          animation: catDropIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes catDropIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .enav-cat-dropdown ul { list-style: none; margin: 0; padding: 8px 0; }
        .enav-cat-dropdown ul li a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 20px;
          text-decoration: none;
          color: var(--dark);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .enav-cat-dropdown ul li a::before {
          content: '';
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0;
          transform: scale(0);
          transition: all 0.15s;
        }
        .enav-cat-dropdown ul li a:hover {
          background: var(--off-white);
          color: var(--primary);
          padding-left: 24px;
        }
        .enav-cat-dropdown ul li a:hover::before {
          opacity: 1;
          transform: scale(1);
        }
        .enav-cat-loading { padding: 16px 20px; color: var(--text-muted); font-size: 13px; }

        /* ---- NAV LINKS ---- */
        .enav-links {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
        }
        .enav-links .nav-item { position: relative; }
        .enav-links .nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 0 16px;
          height: 64px;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          position: relative;
          white-space: nowrap;
        }
        .enav-links .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background: var(--primary);
          border-radius: 3px 3px 0 0;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .enav-links .nav-link:hover { color: var(--white); }
        .enav-links .nav-link:hover::after { width: 60%; }

        /* Dropdown */
        .enav-links .dropdown-menu-custom {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--white);
          min-width: 180px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
          border-top: 3px solid var(--primary);
          z-index: 9999;
          padding: 8px 0;
          animation: catDropIn 0.22s ease forwards;
        }
        .enav-links .nav-item:hover .dropdown-menu-custom { display: block; }
        .enav-links .dropdown-menu-custom a {
          display: block;
          padding: 10px 20px;
          color: var(--dark);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.15s;
        }
        .enav-links .dropdown-menu-custom a:hover {
          background: var(--off-white);
          color: var(--primary);
          padding-left: 24px;
        }

        /* ---- RIGHT ACTIONS ---- */
        .enav-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .enav-icon-btn {
          position: relative;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.75);
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .enav-icon-btn:hover {
          background: rgba(255,107,0,0.12);
          color: var(--primary);
        }

        .enav-cart-badge {
          position: absolute;
          top: 3px;
          right: 3px;
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          font-family: 'Space Mono', monospace;
          box-shadow: 0 0 0 2px var(--dark-2);
          animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        .enav-btn-login {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .enav-btn-login:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(255,107,0,0.08);
        }

        .enav-btn-register {
          background: var(--primary);
          border: 1.5px solid var(--primary);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .enav-btn-register:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px var(--primary-glow);
        }

        .enav-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,107,0,0.12);
          border: 1.5px solid rgba(255,107,0,0.3);
          color: var(--primary);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .enav-user-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .enav-user-avatar {
          width: 26px;
          height: 26px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          flex-shrink: 0;
        }
        .enav-user-btn:hover .enav-user-avatar {
          background: white;
          color: var(--primary);
        }

        /* ---- MOBILE TOGGLE ---- */
        .enav-toggler {
          display: none;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-left: 12px;
          flex-shrink: 0;
        }
        .enav-toggler span {
          display: block;
          width: 20px;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s;
        }

        /* ---- MOBILE MENU ---- */
        .enav-mobile-menu {
          display: none;
          background: var(--dark);
          border-top: 2px solid var(--primary);
          padding: 16px 20px 20px;
          animation: mobileDropIn 0.3s ease forwards;
        }
        @keyframes mobileDropIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .enav-mobile-menu.open { display: block; }
        .enav-mobile-links { list-style: none; margin: 0 0 16px 0; padding: 0; }
        .enav-mobile-links li a {
          display: block;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
        }
        .enav-mobile-links li a:hover { color: var(--primary); }
        .enav-mobile-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 991px) {
          .enav-topbar { display: none; }
          .enav-main { padding: 0 16px; }
          .enav-cat-trigger { display: none; }
          .enav-links { display: none; }
          .enav-toggler { display: flex; }
          .enav-actions .enav-btn-login,
          .enav-actions .enav-btn-register { display: none; }
          .enav-actions .enav-user-btn { display: none; }
        }
        @media (max-width: 480px) {
          .enav-logo-text { font-size: 18px; }
        }
      `}</style>

      <div className={`enav-wrapper ${isSticky ? "sticky" : ""}`}>

        {/* TOP BAR */}
        <div className="enav-topbar">
          <span>🔥 Free shipping on orders over <strong>₹999</strong></span>
          <div className="enav-topbar-links">
            <a href="#">Help Center</a>
            <a href="#">Track Order</a>
            <a href="#">Sell on Electro</a>
          </div>
        </div>

        {/* MAIN BAR */}
        <div className="enav-main">

          {/* LOGO */}
          <Link to="/" className="enav-logo">
            <span className="enav-logo-text">
              Electro<span>.</span>
            </span>
            <span className="enav-logo-dot"></span>
          </Link>

          {/* CATEGORY BUTTON */}
          <button
            className={`enav-cat-trigger ${categoryOpen ? "open" : ""}`}
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <div className="cat-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
            All Categories
            <i className={`fas fa-chevron-${categoryOpen ? "up" : "down"}`} style={{ fontSize: 11, marginLeft: 4 }}></i>
          </button>

          {/* CATEGORY DROPDOWN */}
          {categoryOpen && (
            <div className="enav-cat-dropdown">
              <ul>
                {loading ? (
                  <li><div className="enav-cat-loading">Loading...</div></li>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <a href="/shops">{cat.name}</a>
                    </li>
                  ))
                ) : (
                  <li><div className="enav-cat-loading">No categories found</div></li>
                )}
              </ul>
            </div>
          )}

          {/* NAV LINKS */}
          <ul className="enav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/shops" className="nav-link">Shop</Link>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }}>
                Pages <i className="fas fa-chevron-down" style={{ fontSize: 10 }}></i>
              </span>
              <div className="dropdown-menu-custom">
                <Link to="/best-seller">Bestseller</Link>
                <Link to="/cart">Cart</Link>
              </div>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className="nav-link">Contact</Link>
            </li>
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="enav-actions">

            {/* CART */}
            <Link to="/cart" className="enav-icon-btn">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span className="enav-cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* USER / LOGIN */}
            {userToken ? (
              <Link to="/user/dashboard" className="enav-user-btn">
                <div className="enav-user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                My Account
              </Link>
            ) : (
              <>
                <Link to="/login" className="enav-btn-login">Login</Link>
                <Link to="/register" className="enav-btn-register">Register</Link>
              </>
            )}

            {/* MOBILE TOGGLER */}
            <button className="enav-toggler" onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`enav-mobile-menu ${isOpen ? "open" : ""}`}>
          <ul className="enav-mobile-links">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/shops" onClick={() => setIsOpen(false)}>Shop</Link></li>
            <li><Link to="/best-seller" onClick={() => setIsOpen(false)}>Bestseller</Link></li>
            <li><Link to="/cart" onClick={() => setIsOpen(false)}>Cart</Link></li>
            <li><Link to="/contact-us" onClick={() => setIsOpen(false)}>Contact</Link></li>
            {userToken ? (
              <li><Link to="/user/dashboard" onClick={() => setIsOpen(false)}>My Account</Link></li>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>

          {/* Mobile Category */}
          <div style={{ marginTop: 8 }}>
            <button
              className="enav-cat-trigger"
              style={{ width: "100%", borderRadius: 8, height: 44, justifyContent: "flex-start" }}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <div className="cat-icon">
                <span></span><span></span><span></span>
              </div>
              Browse All Categories
            </button>
            {categoryOpen && (
              <div style={{ marginTop: 8, background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                {loading ? (
                  <div className="enav-cat-loading">Loading...</div>
                ) : categories.map((cat) => (
                  <a key={cat._id} href="/shops" style={{ display: "block", padding: "10px 16px", color: "#1A1A1A", textDecoration: "none", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>
                    {cat.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default HeroNavbar;