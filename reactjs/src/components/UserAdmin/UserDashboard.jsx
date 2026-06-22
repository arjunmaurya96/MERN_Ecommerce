import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/dashboard/user/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboard(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  /* ─────────────── SCOPED STYLES ─────────────── */
  const css = `
    .ud2 {
      --c-orange:        #FF6B1A;
      --c-orange-lt:     #FF8C42;
      --c-orange-pale:   rgba(255,107,26,0.08);
      --c-orange-border: rgba(255,107,26,0.22);
      --c-black:         #111111;
      --c-ink:           #222222;
      --c-ink-2:         #555555;
      --c-ink-3:         #888888;
      --c-rule:          #E8E8E8;
      --c-bg:            #F7F7F5;
      --c-white:         #FFFFFF;
      --c-green:         #1A9E6B;
      --c-green-pale:    rgba(26,158,107,0.08);
      --c-red:           #D93025;
      --c-red-pale:      rgba(217,48,37,0.07);

      font-family: 'Outfit', sans-serif;
      background: var(--c-bg);
      min-height: 100vh;
      padding: 2.5rem 2rem;
      color: var(--c-ink);
      box-sizing: border-box;
    }

    .ud2 *, .ud2 *::before, .ud2 *::after { box-sizing: border-box; }

    /* ── LOADING ── */
    .ud2-loading {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 60vh; gap: 1.25rem;
    }
    .ud2-spin {
      width: 44px; height: 44px; border-radius: 50%;
      border: 3px solid var(--c-rule);
      border-top-color: var(--c-orange);
      animation: ud2-rotate 0.8s linear infinite;
    }
    @keyframes ud2-rotate { to { transform: rotate(360deg); } }
    .ud2-loading p { color: var(--c-ink-3); font-size: 0.88rem; margin: 0; }

    /* ── ALERTS ── */
    .ud2-alert { border-radius: 12px; padding: 1rem 1.4rem; font-size: 0.9rem; font-weight: 500; }
    .ud2-alert-danger  { background:#fff1f0; border:1px solid #fca5a5; color:#b91c1c; }
    .ud2-alert-warning { background:#fffbeb; border:1px solid #fcd34d; color:#92400e; }

    /* ── PAGE HEADER ── */
    .ud2-header {
      display: flex; align-items: flex-end;
      justify-content: space-between; flex-wrap: wrap;
      gap: 1rem; margin-bottom: 2.25rem;
      animation: ud2-up 0.55s ease both;
    }
    .ud2-eyebrow {
      display: flex; align-items: center; gap: 0.55rem;
      font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--c-orange); margin-bottom: 0.5rem;
    }
    .ud2-eyebrow-line {
      display: block; width: 26px; height: 2px;
      background: var(--c-orange); border-radius: 2px;
    }
    .ud2-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 900; line-height: 1.05;
      letter-spacing: -0.02em;
      color: var(--c-black); margin: 0;
    }
    .ud2-title em {
      font-style: normal;
      color: var(--c-orange);
    }
    .ud2-subtitle { margin: 0.5rem 0 0; font-size: 0.92rem; color: var(--c-ink-2); }
    .ud2-subtitle strong { color: var(--c-ink); font-weight: 600; }
    .ud2-date-pill {
      background: var(--c-white);
      border: 1px solid var(--c-rule);
      border-radius: 100px;
      padding: 0.5rem 1.1rem;
      font-size: 0.78rem; font-weight: 500;
      color: var(--c-ink-3); white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    /* ── DIVIDER ── */
    .ud2-divider { border: none; border-top: 1px solid var(--c-rule); margin: 0 0 2rem; }

    /* ── USER CARD ── */
    .ud2-user-card {
      background: var(--c-white);
      border: 1px solid var(--c-rule);
      border-radius: 20px;
      padding: 1.75rem 2rem;
      margin-bottom: 2.25rem;
      display: flex; align-items: center;
      gap: 1.5rem; flex-wrap: wrap;
      position: relative; overflow: hidden;
      box-shadow: 0 2px 16px rgba(0,0,0,0.04);
      animation: ud2-up 0.55s ease 0.1s both;
    }
    .ud2-user-card::before {
      content: '';
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, var(--c-orange), var(--c-orange-lt));
      border-radius: 20px 0 0 20px;
    }
    .ud2-avatar {
      width: 58px; height: 58px; border-radius: 16px;
      background: linear-gradient(135deg, var(--c-orange), var(--c-orange-lt));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem; font-weight: 900;
      color: #fff; flex-shrink: 0;
      box-shadow: 0 6px 20px rgba(255,107,26,0.28);
    }
    .ud2-user-info { flex: 1; min-width: 0; }
    .ud2-user-name {
      font-size: 1.08rem; font-weight: 700;
      color: var(--c-black); margin: 0 0 0.45rem;
    }
    .ud2-user-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; }
    .ud2-meta-row {
      display: flex; align-items: center;
      gap: 0.4rem; font-size: 0.83rem; color: var(--c-ink-2);
    }
    .ud2-meta-row svg { color: var(--c-ink-3); flex-shrink: 0; }
    .ud2-role-tag {
      display: inline-flex; align-items: center; gap: 0.3rem;
      background: var(--c-orange-pale);
      border: 1px solid var(--c-orange-border);
      color: var(--c-orange);
      font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      padding: 0.28rem 0.8rem; border-radius: 100px;
    }

    /* ── SECTION LABEL ── */
    .ud2-section-label {
      display: flex; align-items: center; gap: 0.75rem;
      font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.13em; text-transform: uppercase;
      color: var(--c-ink-3); margin-bottom: 1.1rem;
    }
    .ud2-section-label::after {
      content: ''; flex: 1; height: 1px; background: var(--c-rule);
    }

    /* ── STATS GRID ── */
    .ud2-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.1rem; }
    @media (max-width: 767px) { .ud2-stats { grid-template-columns: 1fr; } }
    @media (min-width: 480px) and (max-width: 767px) { .ud2-stats { grid-template-columns: repeat(2,1fr); } }

    /* ── STAT CARD ── */
    .ud2-stat {
      background: var(--c-white);
      border: 1px solid var(--c-rule);
      border-radius: 18px; padding: 1.6rem 1.5rem;
      position: relative; overflow: hidden;
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
      box-shadow: 0 1px 8px rgba(0,0,0,0.04);
    }
    .ud2-stat:nth-child(1) { animation: ud2-up 0.55s ease 0.2s both; }
    .ud2-stat:nth-child(2) { animation: ud2-up 0.55s ease 0.3s both; }
    .ud2-stat:nth-child(3) { animation: ud2-up 0.55s ease 0.4s both; }

    .ud2-stat:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.09); }
    .ud2-stat--total:hover    { border-color: var(--c-orange-border); }
    .ud2-stat--active:hover   { border-color: rgba(26,158,107,0.28); }
    .ud2-stat--cancelled:hover{ border-color: rgba(217,48,37,0.22); }

    /* top accent stripe */
    .ud2-stat::before {
      content: ''; position: absolute;
      top: 0; left: 1.5rem; right: 1.5rem;
      height: 3px; border-radius: 0 0 6px 6px;
    }
    .ud2-stat--total::before    { background: linear-gradient(90deg, var(--c-orange), var(--c-orange-lt)); }
    .ud2-stat--active::before   { background: var(--c-green); }
    .ud2-stat--cancelled::before{ background: var(--c-red); }

    .ud2-stat-icon {
      width: 40px; height: 40px; border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.2rem;
    }
    .ud2-stat--total .ud2-stat-icon    { background: var(--c-orange-pale); color: var(--c-orange); }
    .ud2-stat--active .ud2-stat-icon   { background: var(--c-green-pale);  color: var(--c-green); }
    .ud2-stat--cancelled .ud2-stat-icon{ background: var(--c-red-pale);    color: var(--c-red); }

    .ud2-stat-label {
      font-size: 0.74rem; font-weight: 600;
      letter-spacing: 0.07em; text-transform: uppercase;
      color: var(--c-ink-3); margin-bottom: 0.4rem;
    }
    .ud2-stat-value {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.2rem, 5vw, 2.8rem);
      font-weight: 900; line-height: 1; letter-spacing: -0.03em;
    }
    .ud2-stat--total .ud2-stat-value    { color: var(--c-black); }
    .ud2-stat--active .ud2-stat-value   { color: var(--c-green); }
    .ud2-stat--cancelled .ud2-stat-value{ color: var(--c-red); }

    .ud2-stat-sub {
      margin: 0.4rem 0 0; font-size: 0.75rem; color: var(--c-ink-3);
    }

    .ud2-bar-track {
      margin-top: 1.15rem; height: 4px;
      border-radius: 99px; background: var(--c-rule); overflow: hidden;
    }
    .ud2-bar-fill {
      height: 100%; border-radius: 99px;
      transform-origin: left;
      animation: ud2-grow 1s cubic-bezier(.22,1,.36,1) 0.7s both;
    }
    .ud2-stat--total .ud2-bar-fill    { background: linear-gradient(90deg, var(--c-orange), var(--c-orange-lt)); }
    .ud2-stat--active .ud2-bar-fill   { background: var(--c-green); }
    .ud2-stat--cancelled .ud2-bar-fill{ background: var(--c-red); }

    @keyframes ud2-grow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes ud2-up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 479px) {
      .ud2 { padding: 1.5rem 1rem; }
      .ud2-user-card { padding: 1.4rem 1.25rem; }
    }
  `;

  /* ─────────────── STATES ─────────────── */
  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="ud2">
          <div className="ud2-loading">
            <div className="ud2-spin" />
            <p>Loading your dashboard…</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{css}</style>
        <div className="ud2">
          <div className="ud2-alert ud2-alert-danger">{error}</div>
        </div>
      </>
    );
  }

  if (!dashboard?.success) {
    return (
      <>
        <style>{css}</style>
        <div className="ud2">
          <div className="ud2-alert ud2-alert-warning">No dashboard data found</div>
        </div>
      </>
    );
  }

  const { user, stats } = dashboard;

  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const total      = stats.totalOrders || 1;
  const activePct  = Math.round((stats.activeOrders    / total) * 100);
  const cancelPct  = Math.round((stats.cancelledOrders / total) * 100);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  /* ─────────────── UI ─────────────── */
  return (
    <>
      <style>{css}</style>
      <div className="ud2">

        {/* PAGE HEADER */}
        <div className="ud2-header">
          <div>
            <div className="ud2-eyebrow">
              <span className="ud2-eyebrow-line" />
              User Panel
            </div>
            <h1 className="ud2-title">
              My <em>Dashboard</em>
            </h1>
            <p className="ud2-subtitle">
              Welcome back, <strong>{user?.name}</strong>
            </p>
          </div>
          <div className="ud2-date-pill">{today}</div>
        </div>

        <hr className="ud2-divider" />

        {/* USER CARD */}
        <div className="ud2-user-card">
          <div className="ud2-avatar">{getInitials(user?.name)}</div>
          <div className="ud2-user-info">
            <p className="ud2-user-name">{user?.name}</p>
            <div className="ud2-user-meta">
              <span className="ud2-meta-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                {user.email}
              </span>
              <span className="ud2-role-tag">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                </svg>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="ud2-section-label">Order Statistics</div>
        <div className="ud2-stats">

          {/* Total */}
          <div className="ud2-stat ud2-stat--total">
            <div className="ud2-stat-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="ud2-stat-label">Total Orders</div>
            <div className="ud2-stat-value">{stats.totalOrders}</div>
            <p className="ud2-stat-sub">All time orders placed</p>
            <div className="ud2-bar-track">
              <div className="ud2-bar-fill" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Active */}
          <div className="ud2-stat ud2-stat--active">
            <div className="ud2-stat-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div className="ud2-stat-label">Active Orders</div>
            <div className="ud2-stat-value">{stats.activeOrders}</div>
            <p className="ud2-stat-sub">{activePct}% of total orders</p>
            <div className="ud2-bar-track">
              <div className="ud2-bar-fill" style={{ width: `${activePct}%` }} />
            </div>
          </div>

          {/* Cancelled */}
          <div className="ud2-stat ud2-stat--cancelled">
            <div className="ud2-stat-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6M9 9l6 6"/>
              </svg>
            </div>
            <div className="ud2-stat-label">Cancelled Orders</div>
            <div className="ud2-stat-value">{stats.cancelledOrders}</div>
            <p className="ud2-stat-sub">{cancelPct}% of total orders</p>
            <div className="ud2-bar-track">
              <div className="ud2-bar-fill" style={{ width: `${cancelPct}%` }} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default UserDashboard;