import React from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --pb-orange: #f28b00;
    --pb-orange-dark: #c97200;
    --pb-orange-light: #fff3e0;
    --pb-dark: #0d0d0d;
    --pb-navy: #0c1824;
    --pb-white: #ffffff;
    --pb-muted: rgba(255,255,255,0.55);
    --pb-radius: 22px;
    --pb-transition: 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .pb-section {
    padding: 80px 0 90px;
    background: #f2efe9;
    font-family: 'DM Sans', sans-serif;
  }

  .pb-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: stretch;
  }

  /* ── CARD BASE ── */
  .pb-card {
    position: relative;
    border-radius: var(--pb-radius);
    overflow: hidden;
    display: block;
    text-decoration: none;
    cursor: pointer;
    min-height: 400px;
    transition: var(--pb-transition);
  }
  .pb-card:hover { transform: translateY(-7px); text-decoration: none; }

  /* ── BACKGROUND IMAGE ── */
  .pb-card-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }
  .pb-card:hover .pb-card-img { transform: scale(1.07); }

  /* ── OVERLAYS ── */
  .pb-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  /* Card 1 — dark navy overlay with orange tint */
  .pb-card-1 .pb-overlay {
    background: linear-gradient(
      135deg,
      rgba(12, 24, 36, 0.88) 0%,
      rgba(12, 24, 36, 0.60) 55%,
      rgba(242, 139, 0, 0.22) 100%
    );
  }
  /* Card 2 — orange overlay */
  .pb-card-2 .pb-overlay {
    background: linear-gradient(
      135deg,
      rgba(200, 114, 0, 0.92) 0%,
      rgba(242, 139, 0, 0.75) 55%,
      rgba(242, 139, 0, 0.45) 100%
    );
  }

  /* subtle grid dots texture */
  .pb-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    z-index: 2;
    pointer-events: none;
  }

  /* Glow blob */
  .pb-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.25;
    transition: opacity 0.4s ease;
  }
  .pb-card:hover .pb-blob { opacity: 0.42; }
  .pb-card-1 .pb-blob {
    width: 300px; height: 300px;
    background: var(--pb-orange);
    bottom: -60px; right: -60px;
  }
  .pb-card-2 .pb-blob {
    width: 280px; height: 280px;
    background: #fff;
    top: -60px; left: -60px;
  }

  /* ── CONTENT ── */
  .pb-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    min-height: 400px;
    padding: 40px 38px;
  }

  /* ── CARD 1 CONTENT ── */
  .pb-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    margin-bottom: 14px;
    padding: 5px 14px;
    border-radius: 20px;
    align-self: flex-start;
  }
  .pb-card-1 .pb-eyebrow {
    background: rgba(242,139,0,0.15);
    color: var(--pb-orange);
    border: 1px solid rgba(242,139,0,0.35);
  }
  .pb-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--pb-orange);
    animation: pbPulse 1.8s ease-in-out infinite;
  }
  @keyframes pbPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  .pb-product-sub {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    color: var(--pb-muted);
    margin: 0 0 8px;
  }
  .pb-product-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(44px, 5.5vw, 64px);
    color: var(--pb-white);
    line-height: 1;
    letter-spacing: 2px;
    margin: 0 0 6px;
  }
  .pb-product-name span {
    color: var(--pb-orange);
  }
  .pb-price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 14px 0 26px;
  }
  .pb-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 38px;
    color: var(--pb-white);
    letter-spacing: 1px;
    line-height: 1;
  }
  .pb-price-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--pb-muted);
  }

  /* ── CARD 2 CONTENT ── */
  .pb-card-2 .pb-content {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .pb-sale-badge {
    display: inline-block;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(68px, 9vw, 100px);
    color: var(--pb-white);
    line-height: 1;
    letter-spacing: 8px;
    text-shadow: 0 4px 32px rgba(0,0,0,0.25);
    margin-bottom: 6px;
  }
  .pb-sale-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 600;
    color: rgba(255,255,255,0.92);
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
  .pb-sale-detail {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 30px;
  }

  /* ── DIVIDER LINE ── */
  .pb-divider {
    width: 48px;
    height: 2px;
    background: rgba(255,255,255,0.3);
    margin: 0 auto 28px;
    border-radius: 2px;
  }

  /* ── CTA BUTTONS ── */
  .pb-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    padding: 13px 30px;
    border-radius: 50px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: var(--pb-transition);
  }
  .pb-btn-arrow {
    font-size: 15px;
    transition: transform 0.3s ease;
  }
  .pb-card:hover .pb-btn-arrow { transform: translateX(5px); }

  /* Card 1 button */
  .pb-card-1 .pb-btn {
    background: var(--pb-orange);
    color: var(--pb-dark);
    box-shadow: 0 6px 24px rgba(242,139,0,0.4);
  }
  .pb-card-1 .pb-btn:hover {
    background: #ffaa33;
    box-shadow: 0 10px 32px rgba(242,139,0,0.55);
    transform: scale(1.03);
  }
  /* Card 2 button */
  .pb-card-2 .pb-btn {
    background: var(--pb-dark);
    color: var(--pb-white);
    box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  }
  .pb-card-2 .pb-btn:hover {
    background: #1a1a1a;
    box-shadow: 0 10px 32px rgba(0,0,0,0.5);
    transform: scale(1.03);
  }

  /* ── CORNER ACCENT — Card 1 ── */
  .pb-corner-tag {
    position: absolute;
    top: 22px;
    right: 22px;
    z-index: 4;
    background: var(--pb-orange);
    color: var(--pb-dark);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 2px;
    padding: 6px 16px;
    border-radius: 20px;
  }

  /* ── CARD 2 PERCENT BADGE ── */
  .pb-percent-ring {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 4;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--pb-dark);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .pb-percent-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    color: var(--pb-orange);
    line-height: 1;
  }
  .pb-percent-off {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    line-height: 1;
  }

  /* hover shadow */
  .pb-card-1 { box-shadow: 0 8px 40px rgba(12,24,36,0.3); }
  .pb-card-1:hover { box-shadow: 0 24px 64px rgba(12,24,36,0.45); }
  .pb-card-2 { box-shadow: 0 8px 40px rgba(200,114,0,0.3); }
  .pb-card-2:hover { box-shadow: 0 24px 64px rgba(200,114,0,0.45); }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .pb-grid { grid-template-columns: 1fr; }
    .pb-card { min-height: 340px; }
    .pb-content { padding: 32px 30px; min-height: 340px; }
  }
  @media (max-width: 575px) {
    .pb-section { padding: 56px 0 64px; }
    .pb-content { padding: 28px 24px; min-height: 300px; }
    .pb-product-name { font-size: 42px; }
    .pb-sale-badge { font-size: 64px; }
    .pb-price { font-size: 30px; }
  }
`;

const ProductBanner = () => {
  return (
    <>
      <style>{styles}</style>

      <section className="pb-section">
        <div className="container-fluid px-4 px-md-5">
          <div className="pb-grid">

            {/* ── CARD 1 — EOS Rebel ── */}
            <a href="#" className="pb-card pb-card-1">
              {/* BG image */}
              <img src="img/product-banner.jpg" className="pb-card-img" alt="EOS Rebel T7i" />

              {/* Overlays */}
              <div className="pb-overlay" />
              <div className="pb-blob" />

              {/* Corner tag */}
              <div className="pb-corner-tag">New Arrival</div>

              {/* Content */}
              <div className="pb-content">
                <div className="pb-eyebrow">
                  <span className="pb-eyebrow-dot" />
                  Camera
                </div>
                <p className="pb-product-sub">Canon DSLR</p>
                <h2 className="pb-product-name">
                  EOS Rebel<br /><span>T7i Kit</span>
                </h2>
                <div className="pb-price-row">
                  <span className="pb-price">$899.99</span>
                  <span className="pb-price-label">Starting from</span>
                </div>
                <a href="#" className="pb-btn" style={{ alignSelf: 'flex-start' }}>
                  Shop Now
                  <span className="pb-btn-arrow">→</span>
                </a>
              </div>
            </a>

            {/* ── CARD 2 — SALE ── */}
            <a href="#" className="pb-card pb-card-2">
              {/* BG image */}
              <img src="img/product-banner-2.jpg" className="pb-card-img" alt="Sale Banner" />

              {/* Overlays */}
              <div className="pb-overlay" />
              <div className="pb-blob" />

              {/* % badge */}
              <div className="pb-percent-ring">
                <span className="pb-percent-num">50%</span>
                <span className="pb-percent-off">OFF</span>
              </div>

              {/* Content */}
              <div className="pb-content">
                <div className="pb-sale-badge">SALE</div>
                <div className="pb-divider" />
                <p className="pb-sale-sub">Get UP To 50% Off</p>
                <p className="pb-sale-detail">On selected items · Today only</p>
                <a href="#" className="pb-btn">
                  Shop Now
                  <span className="pb-btn-arrow">→</span>
                </a>
              </div>
            </a>

          </div>
        </div>
      </section>
    </>
  );
};

export default ProductBanner;