import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --po-dark: #0d0d0d;
    --po-card1-bg: #0f1923;
    --po-card2-bg: #130f1a;
    --po-gold: #c8963e;
    --po-gold-light: #f5e6cc;
    --po-violet: #9b5de5;
    --po-violet-light: #ede0ff;
    --po-white: #ffffff;
    --po-muted: rgba(255,255,255,0.5);
    --po-radius: 24px;
    --po-transition: 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .po-section {
    padding: 80px 0 90px;
    background: #f2efe9;
    font-family: 'DM Sans', sans-serif;
  }

  .po-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* ── CARD BASE ── */
  .po-card {
    position: relative;
    border-radius: var(--po-radius);
    overflow: hidden;
    display: flex;
    align-items: stretch;
    text-decoration: none;
    cursor: pointer;
    min-height: 300px;
    transition: var(--po-transition);
  }
  .po-card:hover {
    transform: translateY(-6px);
    text-decoration: none;
  }

  /* ── CARD 1 — CAMERA (Dark Navy) ── */
  .po-card-1 {
    background: var(--po-card1-bg);
    box-shadow: 0 8px 48px rgba(15,25,35,0.35);
  }
  .po-card-1:hover {
    box-shadow: 0 24px 64px rgba(15,25,35,0.50);
  }

  /* ── CARD 2 — WATCH (Dark Violet) ── */
  .po-card-2 {
    background: var(--po-card2-bg);
    box-shadow: 0 8px 48px rgba(19,15,26,0.35);
  }
  .po-card-2:hover {
    box-shadow: 0 24px 64px rgba(155,93,229,0.30);
  }

  /* ── DECORATIVE BACKGROUND SHAPES ── */
  .po-bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
  }
  .po-card-1 .po-bg-blob {
    width: 260px;
    height: 260px;
    background: rgba(200,150,62,0.18);
    bottom: -60px;
    right: -40px;
  }
  .po-card-2 .po-bg-blob {
    width: 260px;
    height: 260px;
    background: rgba(155,93,229,0.22);
    bottom: -60px;
    right: -40px;
  }

  /* Subtle grid lines overlay */
  .po-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 36px 36px;
    z-index: 0;
    pointer-events: none;
  }

  /* ── INNER LAYOUT ── */
  .po-card-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 40px 36px;
    gap: 24px;
  }

  /* ── TEXT SIDE ── */
  .po-text { flex: 1; min-width: 0; }

  .po-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
    padding: 5px 14px;
    border-radius: 20px;
  }
  .po-card-1 .po-label {
    background: rgba(200,150,62,0.15);
    color: var(--po-gold);
    border: 1px solid rgba(200,150,62,0.3);
  }
  .po-card-2 .po-label {
    background: rgba(155,93,229,0.15);
    color: var(--po-violet);
    border: 1px solid rgba(155,93,229,0.3);
  }
  .po-label-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  .po-card-1 .po-label-dot { background: var(--po-gold); }
  .po-card-2 .po-label-dot { background: var(--po-violet); }

  .po-product-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--po-muted);
    margin: 0 0 6px;
    letter-spacing: 0.5px;
  }

  .po-big-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(42px, 5vw, 58px);
    color: var(--po-white);
    line-height: 1;
    margin: 0 0 20px;
    letter-spacing: 2px;
  }

  /* DISCOUNT BADGE */
  .po-discount {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    margin-bottom: 24px;
  }
  .po-discount-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 7vw, 80px);
    line-height: 0.9;
    letter-spacing: -1px;
  }
  .po-card-1 .po-discount-number { color: var(--po-gold); }
  .po-card-2 .po-discount-number { color: var(--po-violet); }

  .po-discount-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--po-muted);
  }

  /* CTA BUTTON */
  .po-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 11px 24px;
    border-radius: 50px;
    transition: var(--po-transition);
    border: none;
  }
  .po-card-1 .po-cta {
    background: var(--po-gold);
    color: #0f1923;
  }
  .po-card-1:hover .po-cta {
    background: #e0aa55;
    gap: 14px;
  }
  .po-card-2 .po-cta {
    background: var(--po-violet);
    color: #fff;
  }
  .po-card-2:hover .po-cta {
    background: #aa6ef0;
    gap: 14px;
  }
  .po-cta-arrow {
    font-size: 16px;
    transition: transform 0.3s ease;
  }
  .po-card:hover .po-cta-arrow {
    transform: translateX(4px);
  }

  /* ── IMAGE SIDE ── */
  .po-img-wrap {
    flex-shrink: 0;
    position: relative;
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Glowing ring behind image */
  .po-img-glow {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    opacity: 0.18;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .po-card-1 .po-img-glow { background: radial-gradient(circle, var(--po-gold) 0%, transparent 70%); }
  .po-card-2 .po-img-glow { background: radial-gradient(circle, var(--po-violet) 0%, transparent 70%); }
  .po-card:hover .po-img-glow { opacity: 0.32; transform: scale(1.15); }

  .po-img {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 190px;
    height: auto;
    object-fit: contain;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    drop-shadow: 0 8px 24px rgba(0,0,0,0.4);
    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.5));
  }
  .po-card:hover .po-img {
    transform: scale(1.08) translateY(-6px);
  }

  /* TIMER STRIP */
  .po-timer-strip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 36px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(8px);
    z-index: 2;
  }
  .po-timer-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--po-muted);
    margin-right: 4px;
  }
  .po-timer-block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .po-timer-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 1px;
    line-height: 1;
  }
  .po-card-1 .po-timer-num { color: var(--po-gold); }
  .po-card-2 .po-timer-num { color: var(--po-violet); }
  .po-timer-unit {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--po-muted);
  }
  .po-timer-sep {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    color: var(--po-muted);
    opacity: 0.5;
    margin-bottom: 8px;
  }
  .po-timer-ends {
    margin-left: auto;
    font-size: 10px;
    color: var(--po-muted);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .po-grid { grid-template-columns: 1fr; }
    .po-card { min-height: 260px; }
    .po-card-inner { padding: 32px 28px; }
  }
  @media (max-width: 575px) {
    .po-section { padding: 56px 0 64px; }
    .po-card-inner { padding: 28px 22px 64px; }
    .po-img-wrap { width: 130px; }
    .po-big-title { font-size: 36px; }
    .po-discount-number { font-size: 52px; }
    .po-timer-strip { padding: 10px 22px; }
  }
`;

/* ── LIVE COUNTDOWN ── */
const useCountdown = (targetHours) => {
  const [time, setTime] = React.useState(() => {
    const now = new Date();
    const end = new Date(now.getTime() + targetHours * 3600 * 1000);
    return end;
  });
  const [display, setDisplay] = React.useState({ h: "00", m: "00", s: "00" });

  React.useEffect(() => {
    const tick = () => {
      const diff = time - Date.now();
      if (diff <= 0) { setDisplay({ h: "00", m: "00", s: "00" }); return; }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setDisplay({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [time]);

  return display;
};

const TimerStrip = ({ cardClass, hours }) => {
  const { h, m, s } = useCountdown(hours);
  return (
    <div className="po-timer-strip">
      <span className="po-timer-label">Ends in</span>
      <div className="po-timer-block">
        <span className="po-timer-num">{h}</span>
        <span className="po-timer-unit">Hrs</span>
      </div>
      <span className="po-timer-sep">:</span>
      <div className="po-timer-block">
        <span className="po-timer-num">{m}</span>
        <span className="po-timer-unit">Min</span>
      </div>
      <span className="po-timer-sep">:</span>
      <div className="po-timer-block">
        <span className="po-timer-num">{s}</span>
        <span className="po-timer-unit">Sec</span>
      </div>
      <span className="po-timer-ends">Limited offer</span>
    </div>
  );
};

/* ── MAIN COMPONENT ── */
const ProductOffer = () => {
  return (
    <>
      <style>{styles}</style>

      <section className="po-section">
        <div className="container-fluid px-4 px-md-5">
          <div className="po-grid">

            {/* ── CARD 1 — CAMERA ── */}
            <a href="#" className="po-card po-card-1">
              <div className="po-bg-blob" />

              <div className="po-card-inner">
                {/* TEXT */}
                <div className="po-text">
                  <div className="po-label">
                    <span className="po-label-dot" />
                    Best Seller
                  </div>
                  <p className="po-product-name">Find The Best Camera for You!</p>
                  <h2 className="po-big-title">Smart Camera</h2>

                  <div className="po-discount">
                    <span className="po-discount-number">40%</span>
                    <span className="po-discount-label">Off Today</span>
                  </div>

                  <div className="po-cta">
                    Shop Now
                    <span className="po-cta-arrow">→</span>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="po-img-wrap">
                  <div className="po-img-glow" />
                  <img
                    src="img/product-1.png"
                    className="po-img"
                    alt="Smart Camera"
                  />
                </div>
              </div>

              <TimerStrip hours={5} />
            </a>

            {/* ── CARD 2 — WATCH ── */}
            <a href="#" className="po-card po-card-2">
              <div className="po-bg-blob" />

              <div className="po-card-inner">
                {/* TEXT */}
                <div className="po-text">
                  <div className="po-label">
                    <span className="po-label-dot" />
                    New Arrival
                  </div>
                  <p className="po-product-name">Find The Best Watches for You!</p>
                  <h2 className="po-big-title">Smart Watch</h2>

                  <div className="po-discount">
                    <span className="po-discount-number">20%</span>
                    <span className="po-discount-label">Off Today</span>
                  </div>

                  <div className="po-cta">
                    Shop Now
                    <span className="po-cta-arrow">→</span>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="po-img-wrap">
                  <div className="po-img-glow" />
                  <img
                    src="img/product-2.png"
                    className="po-img"
                    alt="Smart Watch"
                  />
                </div>
              </div>

              <TimerStrip hours={12} />
            </a>

          </div>
        </div>
      </section>
    </>
  );
};

export default ProductOffer;