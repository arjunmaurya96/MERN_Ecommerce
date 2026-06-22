import { NavLink } from "react-router-dom";

const UserSidebar = ({ onClose }) => {

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    .usb {
      --o:       #FF6B1A;
      --o-lt:    #FF8C42;
      --o-pale:  rgba(255,107,26,0.09);
      --o-bdr:   rgba(255,107,26,0.22);
      --black:   #0F0F0F;
      --ink:     #1E1E1E;
      --ink2:    #555;
      --ink3:    #999;
      --rule:    #EBEBEB;
      --bg:      #F7F7F5;
      --white:   #FFFFFF;

      font-family: 'Poppins', sans-serif;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--white);
      border-right: 1px solid var(--rule);
      box-sizing: border-box;
    }
    .usb *, .usb *::before, .usb *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── HEADER ── */
    .usb-header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 1.4rem 1.4rem 1.2rem;
      border-bottom: 1px solid var(--rule);
      flex-shrink: 0;
    }
    .usb-brand {
      display: flex; align-items: center; gap: 0.6rem;
    }
    .usb-brand-icon {
      width: 34px; height: 34px; border-radius: 10px;
      background: linear-gradient(135deg, var(--o), var(--o-lt));
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(255,107,26,0.28);
      flex-shrink: 0;
    }
    .usb-brand-text {
      font-size: 0.95rem; font-weight: 700;
      color: var(--black); letter-spacing: -0.01em;
    }
    .usb-brand-text span { color: var(--o); }

    .usb-close {
      display: flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 8px;
      border: 1px solid var(--rule);
      background: var(--bg); color: var(--ink2);
      cursor: pointer; transition: all 0.18s ease;
      font-size: 0.8rem; font-weight: 600;
      flex-shrink: 0;
    }
    .usb-close:hover { border-color: #ccc; color: var(--ink); background: #efefed; }

    /* ── SECTION LABEL ── */
    .usb-label {
      font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--ink3); padding: 0 1rem;
      margin: 1.25rem 0 0.5rem;
    }

    /* ── NAV LIST ── */
    .usb-nav {
      list-style: none;
      padding: 0 0.75rem;
      display: flex; flex-direction: column; gap: 2px;
      flex: 1;
      overflow-y: auto;
    }

    /* ── NAV LINK ── */
    .usb-link {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.65rem 0.9rem;
      border-radius: 11px;
      text-decoration: none;
      color: var(--ink2);
      font-size: 0.84rem; font-weight: 500;
      transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
      position: relative;
      border: 1px solid transparent;
    }
    .usb-link:hover {
      background: var(--bg);
      color: var(--ink);
      transform: translateX(3px);
    }
    .usb-link.active {
      background: var(--o-pale);
      color: var(--o);
      font-weight: 600;
      border-color: var(--o-bdr);
    }
    .usb-link.active .usb-link-icon {
      color: var(--o);
      background: rgba(255,107,26,0.12);
    }
    /* active left bar */
    .usb-link.active::before {
      content: '';
      position: absolute; left: -0.75rem; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 60%;
      background: var(--o);
      border-radius: 0 3px 3px 0;
    }

    .usb-link-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg);
      color: var(--ink3);
      flex-shrink: 0;
      transition: all 0.18s ease;
    }
    .usb-link:hover .usb-link-icon {
      background: var(--rule);
      color: var(--ink2);
    }

    .usb-link-text { flex: 1; }

    .usb-link-arrow {
      opacity: 0; transform: translateX(-4px);
      transition: all 0.18s ease;
      color: var(--o);
    }
    .usb-link:hover .usb-link-arrow,
    .usb-link.active .usb-link-arrow {
      opacity: 1; transform: translateX(0);
    }

    /* ── FOOTER ── */
    .usb-footer {
      padding: 1rem 1.4rem 1.25rem;
      border-top: 1px solid var(--rule);
      flex-shrink: 0;
    }
    .usb-footer-note {
      font-size: 0.68rem; color: var(--ink3);
      text-align: center; letter-spacing: 0.02em;
    }
    .usb-footer-note span { color: var(--o); font-weight: 600; }
  `;

  const navItems = [
    {
      to: "/user/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      to: "/user/orders",
      label: "My Orders",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <line x1="3" x2="21" y1="6" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
    {
      to: "/user/profile",
      label: "Profile",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
    },
    {
      to: "/user/track-order",
      label: "Track Order",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
    },
  ];

  const ArrowIcon = () => (
    <svg className="usb-link-arrow" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );

  return (
    <>
      <style>{css}</style>
      <div className="usb">

        {/* HEADER */}
        <div className="usb-header">
          <div className="usb-brand">
            <div className="usb-brand-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <span className="usb-brand-text">My <span>Account</span></span>
          </div>

          {onClose && (
            <button className="usb-close" onClick={onClose} aria-label="Close sidebar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* LABEL */}
        <div className="usb-label">Navigation</div>

        {/* MENU */}
        <ul className="usb-nav">
          {navItems.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `usb-link${isActive ? " active" : ""}`
                }
              >
                <span className="usb-link-icon">{icon}</span>
                <span className="usb-link-text">{label}</span>
                <ArrowIcon />
              </NavLink>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="usb-footer">
          <p className="usb-footer-note">
            Powered by <span>CoderLife </span>
          </p>
        </div>

      </div>
    </>
  );
};

export default UserSidebar;