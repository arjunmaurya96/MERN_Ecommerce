import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ============================================================
   ALL CSS — fully self-contained, zero external stylesheet needed
   Primary Color : #ff6b00 (Orange)
   Font          : Poppins (Google Fonts)
   Logic         : unchanged from original
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  .hero-section,
  .hero-section * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }

  .hero-section {
    display: flex;
    align-items: stretch;
    min-height: 100vh;
    background: #ffffff;
    position: relative;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .hero-left {
    flex: 1;
    min-width: 0;
    padding: 90px 56px 90px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    background: #ffffff;
  }

  .hero-badge-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .hero-badge-dot {
    width: 9px;
    height: 9px;
    background: #ff6b00;
    border-radius: 50%;
    flex-shrink: 0;
    animation: heroPulse 1.6s infinite;
  }

  @keyframes heroPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,107,0,0.5); }
    50%       { opacity: .6; box-shadow: 0 0 0 7px rgba(255,107,0,0); }
  }

  .hero-badge-pill {
    background: #fff4ec;
    border: 1.5px solid #ffcba4;
    color: #cc4e00;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 999px;
  }

  .hero-title {
    font-size: clamp(2rem, 3.6vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    color: #111827;
    margin-bottom: 16px;
  }

  .hero-title-orange { color: #ff6b00; }

  .hero-subtitle {
    font-size: 15px;
    font-weight: 400;
    color: #6b7280;
    line-height: 1.75;
    max-width: 420px;
    margin-bottom: 28px;
  }

  /* Trust row */
  .hero-trust {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }

  .hero-avatars { display: flex; }

  .hero-av {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-right: -9px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .av-o1 { background: #ff6b00; }
  .av-o2 { background: #ff8c38; }
  .av-o3 { background: #e65500; }
  .av-o4 { background: #ff4500; }

  .hero-trust-text {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.6;
    padding-left: 4px;
  }

  .hero-trust-text strong {
    color: #374151;
    font-weight: 600;
  }

  /* CTA */
  .hero-cta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 40px;
  }

  .btn-hero-main {
    background: #ff6b00;
    color: #ffffff;
    border: none;
    padding: 14px 32px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 28px rgba(255,107,0,0.38);
  }

  .btn-hero-main:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(255,107,0,0.52);
    color: #ffffff;
    text-decoration: none;
  }

  .btn-hero-outline {
    background: #ffffff;
    color: #ff6b00;
    border: 2px solid #ff6b00;
    padding: 12px 26px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
    text-decoration: none;
  }

  .btn-hero-outline:hover { background: #fff4ec; text-decoration: none; }

  /* Stats */
  .hero-stats {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    padding-top: 32px;
    border-top: 1px solid #f3f4f6;
  }

  .hero-stat { display: flex; flex-direction: column; gap: 2px; }

  .hero-stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
  }

  .hero-stat-value.orange { color: #ff6b00; }

  .hero-stat-label {
    font-size: 11px;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.3px;
  }

  /* ── RIGHT PANEL ── */
  .hero-right {
    width: 44%;
    background: linear-gradient(148deg, #fff8f2 0%, #fff3e8 45%, #ffeedd 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 36px 36px 30px 28px;
    overflow: hidden;
  }

  .hero-right-circle1 {
    position: absolute;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: rgba(255,107,0,0.07);
    top: -100px; right: -100px;
    pointer-events: none;
  }

  .hero-right-circle2 {
    position: absolute;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(255,107,0,0.05);
    bottom: 30px; left: -60px;
    pointer-events: none;
  }

  /* Carousel */
  .hero-carousel-wrap {
    position: relative;
    flex: 1;
    min-height: 300px;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 36px rgba(0,0,0,0.09);
  }

  .hero-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.55s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 20px 80px;
  }

  .hero-slide.active { opacity: 1; }

  .hero-slide-tag {
    background: #fff4ec;
    color: #cc4e00;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 999px;
    margin-bottom: 16px;
  }

  .hero-device-wrap {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 14px;
  }

  .hero-laptop-img {
    width: 200px;
    filter: drop-shadow(0 14px 32px rgba(255,107,0,0.22));
  }

  .hero-mobile-img {
    width: 110px;
    filter: drop-shadow(0 14px 32px rgba(255,107,0,0.28));
  }

  .hero-slide-name {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    text-align: center;
  }

  .hero-slide-prices {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hero-price-old {
    font-size: 13px;
    color: #9ca3af;
    text-decoration: line-through;
    font-weight: 500;
  }

  .hero-price-new {
    font-size: 22px;
    font-weight: 700;
    color: #ff6b00;
  }

  .hero-discount-badge {
    background: #fff4ec;
    border: 1px solid #ffcba4;
    color: #cc4e00;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 999px;
  }

  .hero-slide-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
    height: 80px;
    pointer-events: none;
  }

  /* Nav arrows */
  .hero-carousel-nav {
    position: absolute;
    top: 14px; right: 14px;
    display: flex; gap: 6px; z-index: 10;
  }

  .hero-nav-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1.5px solid #ffd4b3;
    background: #ffffff;
    color: #ff6b00;
    font-size: 18px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    user-select: none;
    line-height: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }

  .hero-nav-btn:hover {
    background: #ff6b00;
    color: #ffffff;
    border-color: #ff6b00;
  }

  /* Dots */
  .hero-dots {
    display: flex; gap: 6px; justify-content: center; padding: 12px 0 10px;
  }

  .hero-dot {
    width: 6px; height: 6px;
    border-radius: 999px;
    background: #ffd4b3;
    cursor: pointer;
    border: none; outline: none;
    transition: width 0.3s, background 0.3s;
    padding: 0;
  }

  .hero-dot.active { width: 22px; background: #ff6b00; }

  /* Banner card */
  .hero-banner {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff;
    border: 1.5px solid #ffe4cc;
    border-radius: 14px;
    padding: 14px 16px;
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
  }

  .hero-banner:hover {
    border-color: #ff6b00;
    transform: translateY(-2px);
    text-decoration: none;
  }

  .hero-banner-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #fff4ec, #ffe4cc);
    border: 1px solid #ffd4b3;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .hero-banner-body { flex: 1; min-width: 0; }

  .hero-banner-label {
    font-size: 9.5px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 1.3px; margin-bottom: 2px;
  }

  .hero-banner-name {
    font-size: 13px; font-weight: 600; color: #111827;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .hero-banner-prices {
    display: flex; align-items: center; gap: 8px; margin-top: 4px;
  }

  .hero-banner-old {
    font-size: 11px; color: #9ca3af;
    text-decoration: line-through; font-weight: 400;
  }

  .hero-banner-new { font-size: 15px; font-weight: 700; color: #ff6b00; }

  .hero-banner-save {
    background: #fff4ec; border: 1px solid #ffcba4;
    color: #cc4e00; font-size: 9.5px; font-weight: 700;
    padding: 2px 8px; border-radius: 999px;
  }

  .hero-banner-btn {
    background: #ff6b00; color: #ffffff; border: none;
    padding: 10px 18px; border-radius: 999px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    white-space: nowrap; font-family: 'Poppins', sans-serif;
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .hero-banner-btn:hover {
    box-shadow: 0 4px 16px rgba(255,107,0,0.4);
    transform: translateY(-1px);
  }

  /* Animations */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-left > * { animation: heroFadeUp 0.6s ease both; }
  .hero-left > *:nth-child(1) { animation-delay: 0.05s; }
  .hero-left > *:nth-child(2) { animation-delay: 0.14s; }
  .hero-left > *:nth-child(3) { animation-delay: 0.22s; }
  .hero-left > *:nth-child(4) { animation-delay: 0.30s; }
  .hero-left > *:nth-child(5) { animation-delay: 0.38s; }
  .hero-left > *:nth-child(6) { animation-delay: 0.46s; }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .hero-left  { padding: 70px 40px 70px 48px; }
    .hero-right { width: 46%; padding: 32px 28px 26px; }
  }

  @media (max-width: 860px) {
    .hero-section { flex-direction: column; }
    .hero-left  { padding: 52px 32px 36px; order: 1; }
    .hero-right { width: 100%; padding: 0 28px 36px; order: 2; background: #fff8f2; }
    .hero-carousel-wrap { min-height: 280px; }
    .hero-stats { gap: 20px; }
    .hero-stat-value { font-size: 20px; }
  }

  @media (max-width: 560px) {
    .hero-left    { padding: 40px 20px 28px; }
    .hero-right   { padding: 0 20px 32px; }
    .hero-title   { font-size: 1.85rem; }
    .hero-cta     { flex-direction: column; align-items: flex-start; }
    .btn-hero-main,
    .btn-hero-outline { width: 100%; justify-content: center; }
    .hero-stats   { gap: 16px; }
    .hero-banner  { flex-wrap: wrap; }
    .hero-carousel-wrap { min-height: 240px; }
  }
`;

/* ── Laptop SVG (inline — no external image) ── */
const LaptopSVG = () => (
  <svg className="hero-laptop-img" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="8" width="208" height="130" rx="9" fill="#1c1c1e" />
    <rect x="24" y="16" width="192" height="114" rx="5" fill="#2c2c2e" />
    <rect x="28" y="20" width="184" height="106" rx="4" fill="#fff8f2" />
    <rect x="28" y="20" width="184" height="22" rx="4" fill="#ff6b00" />
    <circle cx="42" cy="31" r="4" fill="rgba(255,255,255,0.5)" />
    <circle cx="55" cy="31" r="4" fill="rgba(255,255,255,0.5)" />
    <circle cx="68" cy="31" r="4" fill="rgba(255,255,255,0.5)" />
    <rect x="80" y="25" width="110" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
    <rect x="28" y="42" width="90" height="52" rx="3" fill="#ffe4cc" />
    <rect x="42" y="56" width="62" height="8" rx="4" fill="#ff6b00" opacity="0.5" />
    <rect x="50" y="69" width="46" height="5" rx="2.5" fill="#ff6b00" opacity="0.3" />
    <rect x="126" y="46" width="76" height="6" rx="3" fill="#374151" opacity="0.7" />
    <rect x="126" y="58" width="60" height="4" rx="2" fill="#9ca3af" opacity="0.6" />
    <rect x="126" y="68" width="68" height="4" rx="2" fill="#9ca3af" opacity="0.5" />
    <rect x="126" y="78" width="52" height="4" rx="2" fill="#9ca3af" opacity="0.4" />
    <rect x="126" y="92" width="58" height="18" rx="9" fill="#ff6b00" />
    <rect x="130" y="97" width="50" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
    <rect x="28" y="106" width="184" height="20" rx="0" fill="#f3f4f6" />
    <rect x="36" y="111" width="30" height="10" rx="5" fill="#d1d5db" />
    <rect x="72" y="111" width="44" height="10" rx="5" fill="#d1d5db" />
    <rect x="122" y="111" width="30" height="10" rx="5" fill="#d1d5db" />
    <rect x="0" y="138" width="240" height="14" rx="4" fill="#2c2c2e" />
    <rect x="88" y="139" width="64" height="12" rx="3" fill="#1c1c1e" />
    <ellipse cx="120" cy="145" rx="10" ry="4.5" fill="#3a3a3c" />
  </svg>
);

/* ── Mobile SVG (inline — no external image) ── */
const MobileSVG = () => (
  <svg className="hero-mobile-img" viewBox="0 0 100 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="92" height="182" rx="16" fill="#1c1c1e" />
    <rect x="10" y="16" width="80" height="158" rx="10" fill="#fff8f2" />
    <rect x="34" y="8" width="32" height="6" rx="3" fill="#111" />
    <circle cx="70" cy="11" r="2.5" fill="#333" />
    <rect x="14" y="20" width="40" height="5" rx="2.5" fill="#ff6b00" opacity="0.15" />
    <rect x="72" y="20" width="14" height="5" rx="2.5" fill="#e5e7eb" />
    <rect x="10" y="30" width="80" height="34" rx="6" fill="#ff6b00" />
    <rect x="16" y="36" width="45" height="6" rx="3" fill="rgba(255,255,255,0.7)" />
    <rect x="16" y="46" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.45)" />
    <rect x="68" y="34" width="16" height="26" rx="4" fill="rgba(255,255,255,0.15)" />
    <rect x="14" y="70" width="72" height="60" rx="8" fill="#ffffff" />
    <rect x="14" y="70" width="72" height="60" rx="8" stroke="#ffe4cc" strokeWidth="1" />
    <rect x="20" y="76" width="60" height="30" rx="5" fill="#fff4ec" />
    <rect x="32" y="82" width="36" height="18" rx="4" fill="#ff6b00" opacity="0.2" />
    <rect x="38" y="86" width="24" height="10" rx="3" fill="#ff6b00" opacity="0.4" />
    <rect x="20" y="112" width="38" height="5" rx="2.5" fill="#374151" />
    <rect x="60" y="110" width="20" height="9" rx="4.5" fill="#ff6b00" />
    <rect x="14" y="136" width="34" height="28" rx="6" fill="#ffffff" stroke="#ffe4cc" strokeWidth="1" />
    <rect x="52" y="136" width="34" height="28" rx="6" fill="#ffffff" stroke="#ffe4cc" strokeWidth="1" />
    <rect x="18" y="140" width="26" height="14" rx="3" fill="#fff4ec" />
    <rect x="56" y="140" width="26" height="14" rx="3" fill="#fff4ec" />
    <rect x="20" y="156" width="22" height="4" rx="2" fill="#d1d5db" />
    <rect x="58" y="156" width="22" height="4" rx="2" fill="#d1d5db" />
    <rect x="10" y="168" width="80" height="6" rx="3" fill="#f3f4f6" />
    <rect x="24" y="170" width="12" height="2" rx="1" fill="#9ca3af" />
    <rect x="44" y="170" width="12" height="2" rx="1" fill="#ff6b00" />
    <rect x="64" y="170" width="12" height="2" rx="1" fill="#9ca3af" />
    <rect x="36" y="178" width="28" height="4" rx="2" fill="#d1d5db" />
  </svg>
);

/* ── Slide data ── */
const slides = [
  {
    id: 1,
    tag: 'Featured Deal',
    name: 'MacBook Pro M3',
    oldPrice: '$2,499',
    newPrice: '$1,899',
    discount: '24% Off',
    device: 'laptop',
  },
  {
    id: 2,
    tag: 'Hot Deal',
    name: 'iPhone 16 Pro',
    oldPrice: '$1,199',
    newPrice: '$999',
    discount: '17% Off',
    device: 'mobile',
  },
];

/* ================================================================
   HERO COMPONENT — same logic, redesigned visuals
   ================================================================ */
const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <>
      <style>{styles}</style>

      <section className="hero-section">

        {/* ══════════ LEFT ══════════ */}
        <div className="hero-left">

          <div className="hero-badge-row">
            <div className="hero-badge-dot" />
            <div className="hero-badge-pill">Mega Sale — Live Now</div>
          </div>

          <h1 className="hero-title">
            Save Up To{' '}
            <span className="hero-title-orange">50% Off</span>
            <br />
            On Selected Laptops,
            <br />
            Desktops &amp; Smartphones
          </h1>

          <p className="hero-subtitle">
            Grab the latest tech at unbeatable prices. Limited-time offer —
            terms and conditions apply.
          </p>

          <div className="hero-trust">
            <div className="hero-avatars">
              <div className="hero-av av-o1">A</div>
              <div className="hero-av av-o2">S</div>
              <div className="hero-av av-o3">M</div>
              <div className="hero-av av-o4">R</div>
            </div>
            <p className="hero-trust-text">
              <strong>12,000+</strong> happy customers &nbsp;⭐ 4.9 / 5 rating
            </p>
          </div>

          <div className="hero-cta">
            <Link to="/shops" className="btn-hero-main">
              Shop Now &rarr;
            </Link>
            <Link to="/shops" className="btn-hero-outline">
              View All Deals
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value orange">50%</span>
              <span className="hero-stat-label">Max Discount</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">
                500<span style={{ color: '#ff6b00' }}>+</span>
              </span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value orange">Free</span>
              <span className="hero-stat-label">Delivery</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">24/7</span>
              <span className="hero-stat-label">Support</span>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT ══════════ */}
        <div className="hero-right">
          <div className="hero-right-circle1" />
          <div className="hero-right-circle2" />

          {/* Carousel */}
          <div className="hero-carousel-wrap">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`hero-slide${idx === current ? ' active' : ''}`}
              >
                <div className="hero-slide-tag">{slide.tag}</div>

                <div className="hero-device-wrap">
                  {slide.device === 'laptop' ? <LaptopSVG /> : <MobileSVG />}
                </div>

                <div className="hero-slide-name">{slide.name}</div>

                <div className="hero-slide-prices">
                  <span className="hero-price-old">{slide.oldPrice}</span>
                  <span className="hero-price-new">{slide.newPrice}</span>
                  <span className="hero-discount-badge">{slide.discount}</span>
                </div>
              </div>
            ))}

            <div className="hero-slide-overlay" />

            <div className="hero-carousel-nav">
              <button className="hero-nav-btn" onClick={prev} aria-label="Previous slide">
                &#8249;
              </button>
              <button className="hero-nav-btn" onClick={next} aria-label="Next slide">
                &#8250;
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="hero-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-dot${idx === current ? ' active' : ''}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Banner offer */}
          <Link to="/shops" className="hero-banner">
            <div className="hero-banner-icon">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="3" y="2" width="20" height="22" rx="3" fill="#ff6b00" opacity="0.18" />
                <rect x="1" y="5" width="24" height="16" rx="2" fill="#ff6b00" opacity="0.35" />
                <rect x="4" y="7" width="18" height="12" rx="1" fill="#fff4ec" />
                <rect x="11" y="22" width="4" height="3" rx="1" fill="#ff6b00" opacity="0.45" />
              </svg>
            </div>

            <div className="hero-banner-body">
              <div className="hero-banner-label">Special Offer</div>
              <div className="hero-banner-name">Apple iPad Mini G2356</div>
              <div className="hero-banner-prices">
                <span className="hero-banner-old">$1,250.00</span>
                <span className="hero-banner-new">$1,050.00</span>
                <span className="hero-banner-save">Save 50%</span>
              </div>
            </div>

            <button className="hero-banner-btn">
              <i className="fas fa-shopping-cart" style={{ fontSize: '11px' }} />
              Shop Now
            </button>
          </Link>
        </div>

      </section>
    </>
  );
};

export default Hero;