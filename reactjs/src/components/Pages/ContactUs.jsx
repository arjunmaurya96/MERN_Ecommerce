import React, { useState, useCallback } from "react";
import HeroNavbar from "./HeroNavbar";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
  /* ── TOKENS ── */
  .cu-root {
    --cu-orange      : #FF6B00;
    --cu-orange-dark : #E05A00;
    --cu-orange-light: #FFF4EC;
    --cu-orange-glow : rgba(255,107,0,0.15);
    --cu-dark        : #1A1A1A;
    --cu-text        : #3D3D3D;
    --cu-muted       : #7A7A8A;
    --cu-bg          : #F8F5F2;
    --cu-surface     : #FFFFFF;
    --cu-border      : #EDE8E3;
    --cu-radius      : 20px;
    --cu-radius-sm   : 12px;
    --cu-shadow      : 0 4px 24px rgba(0,0,0,0.07);
    --cu-shadow-lg   : 0 12px 48px rgba(0,0,0,0.10);
    font-family: 'Poppins', sans-serif;
  }

  /* ── PAGE HEADER ── */
  .cu-header {
    background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #E05A00 100%);
    padding: 72px 0 60px;
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  .cu-header::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .cu-header::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -40px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .cu-header-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--cu-orange);
    margin-bottom: 12px;
    position: relative; z-index: 1;
  }
  .cu-header-eyebrow::before,
  .cu-header-eyebrow::after {
    content: '';
    display: block;
    width: 28px; height: 1.5px;
    background: var(--cu-orange);
    border-radius: 2px;
  }
  .cu-header h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: #fff;
    margin: 0 0 16px;
    line-height: 1.15;
    position: relative; z-index: 1;
  }
  .cu-header h1 span {
    color: var(--cu-orange);
  }
  .cu-breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.55);
    position: relative; z-index: 1;
  }
  .cu-breadcrumb a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; }
  .cu-breadcrumb a:hover { color: var(--cu-orange); }
  .cu-breadcrumb .sep { opacity: 0.4; }

  /* ── SECTION ── */
  .cu-section {
    background: var(--cu-bg);
    padding: 80px 0 100px;
  }

  /* ── LAYOUT ── */
  .cu-inner {
    display: grid;
    grid-template-columns: 1fr 1.55fr;
    gap: 36px;
    align-items: start;
  }

  /* ── LEFT PANEL ── */
  .cu-left {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .cu-left-intro {
    background: linear-gradient(145deg, var(--cu-dark) 0%, #2A2A2A 100%);
    border-radius: var(--cu-radius);
    padding: 36px 30px;
    position: relative;
    overflow: hidden;
  }
  .cu-left-intro::before {
    content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(255,107,0,0.25) 0%, transparent 70%);
    border-radius: 50%;
  }
  .cu-left-intro .eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cu-orange);
    margin-bottom: 12px;
    display: block;
  }
  .cu-left-intro h2 {
    font-size: 1.55rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
    line-height: 1.3;
  }
  .cu-left-intro p {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    margin: 0;
    position: relative; z-index: 1;
  }

  /* CONTACT CARDS */
  .cu-card {
    background: var(--cu-surface);
    border-radius: var(--cu-radius-sm);
    border: 1px solid var(--cu-border);
    padding: 20px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--cu-shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    text-decoration: none;
  }
  .cu-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--cu-shadow-lg);
    border-color: var(--cu-orange);
  }
  .cu-card-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: var(--cu-orange-light);
    color: var(--cu-orange);
    font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.25s, color 0.25s;
  }
  .cu-card:hover .cu-card-icon {
    background: var(--cu-orange);
    color: #fff;
  }
  .cu-card-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--cu-muted);
    margin-bottom: 3px;
  }
  .cu-card-value {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--cu-dark);
    margin: 0;
  }

  /* MAP */
  .cu-map-wrap {
    border-radius: var(--cu-radius-sm);
    overflow: hidden;
    border: 1px solid var(--cu-border);
    box-shadow: var(--cu-shadow);
    line-height: 0;
  }
  .cu-map-wrap iframe {
    width: 100%;
    height: 210px;
    display: block;
    border: none;
    filter: grayscale(20%) contrast(1.05);
  }

  /* ── RIGHT: FORM ── */
  .cu-form-card {
    background: var(--cu-surface);
    border-radius: var(--cu-radius);
    border: 1px solid var(--cu-border);
    box-shadow: var(--cu-shadow-lg);
    overflow: hidden;
  }
  .cu-form-header {
    background: linear-gradient(135deg, var(--cu-orange-dark) 0%, var(--cu-orange) 100%);
    padding: 28px 36px 24px;
  }
  .cu-form-header p {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin: 0 0 6px;
  }
  .cu-form-header h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .cu-form-body {
    padding: 32px 36px 36px;
  }

  /* FIELDS */
  .cu-field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .cu-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .cu-field.full { grid-column: 1 / -1; }
  .cu-field label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--cu-muted);
  }
  .cu-field label span { color: var(--cu-orange); margin-left: 2px; }
  .cu-input {
    width: 100%;
    padding: 11px 15px;
    border: 1.5px solid var(--cu-border);
    border-radius: var(--cu-radius-sm);
    font-family: 'Poppins', sans-serif;
    font-size: 0.86rem;
    color: var(--cu-dark);
    background: #FAFAF9;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .cu-input::placeholder { color: #C0BAB4; }
  .cu-input:focus {
    border-color: var(--cu-orange);
    background: #fff;
    box-shadow: 0 0 0 3px var(--cu-orange-glow);
  }
  .cu-input.error { border-color: #E03A3A; box-shadow: 0 0 0 3px rgba(224,58,58,0.1); }
  .cu-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .cu-error-msg {
    font-size: 0.72rem;
    color: #E03A3A;
    margin-top: 2px;
  }

  /* SUBMIT */
  .cu-submit {
    width: 100%;
    padding: 14px 24px;
    background: linear-gradient(135deg, var(--cu-orange-dark) 0%, var(--cu-orange) 100%);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 20px var(--cu-orange-glow);
  }
  .cu-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(255,107,0,0.35);
  }
  .cu-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  /* SUCCESS BANNER */
  .cu-success {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #F0FDF4;
    border: 1.5px solid #86EFAC;
    border-radius: var(--cu-radius-sm);
    padding: 16px 20px;
    margin-top: 20px;
  }
  .cu-success-icon {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: #22C55E;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .cu-success p { margin: 0; font-size: 0.84rem; color: #166534; font-weight: 500; }

  /* SPINNER */
  .cu-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cuSpin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes cuSpin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 991px) {
    .cu-inner { grid-template-columns: 1fr; }
    .cu-left { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .cu-left-intro { grid-column: 1 / -1; }
    .cu-map-wrap { grid-column: 1 / -1; }
    .cu-map-wrap iframe { height: 240px; }
  }
  @media (max-width: 767px) {
    .cu-section { padding: 56px 0 72px; }
    .cu-field-grid { grid-template-columns: 1fr; }
    .cu-form-body { padding: 24px 22px 28px; }
    .cu-form-header { padding: 22px 22px 18px; }
    .cu-left { grid-template-columns: 1fr; }
    .cu-header { padding: 52px 0 44px; }
  }
`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const INITIAL = { name: "", email: "", phone: "", project: "", subject: "", message: "" };

const ContactUs = () => {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  }, [form]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    // Replace with your real API call
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setForm(INITIAL);
  }, [validate]);

  return (
    <div className="cu-root">
      <style>{styles}</style>
      <HeroNavbar />

      {/* ── HEADER ── */}
      <div className="cu-header">
        <div className="cu-header-eyebrow">Contact Us</div>
        <h1>We'd love to <span>hear from you</span></h1>
        <nav className="cu-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep" aria-hidden="true">›</span>
          <span aria-current="page">Contact</span>
        </nav>
      </div>

      {/* ── SECTION ── */}
      <section className="cu-section" aria-label="Contact">
        <div className="container">
          <div className="cu-inner">

            {/* ── LEFT ── */}
            <aside className="cu-left">

              <div className="cu-left-intro">
                <span className="eyebrow">Get in touch</span>
                <h2>Let's talk about your project</h2>
                <p>Have a question, an idea, or want to place a bulk order? Drop us a message and our team will get back to you within 24 hours.</p>
              </div>

              {/* Phone */}
              <a href="tel:+919999999999" className="cu-card" aria-label="Call us">
                <div className="cu-card-icon" aria-hidden="true">
                  <i className="fas fa-phone-alt" />
                </div>
                <div>
                  <div className="cu-card-label">Phone</div>
                  <p className="cu-card-value">+91 99999 99999</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:hello@yourstore.com" className="cu-card" aria-label="Email us">
                <div className="cu-card-icon" aria-hidden="true">
                  <i className="fas fa-envelope" />
                </div>
                <div>
                  <div className="cu-card-label">Email</div>
                  <p className="cu-card-value">hello@yourstore.com</p>
                </div>
              </a>

              {/* Address */}
              <div className="cu-card" style={{ cursor: "default" }}>
                <div className="cu-card-icon" aria-hidden="true">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <div>
                  <div className="cu-card-label">Address</div>
                  <p className="cu-card-value">123 Main Street, New Delhi, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="cu-card" style={{ cursor: "default" }}>
                <div className="cu-card-icon" aria-hidden="true">
                  <i className="fas fa-clock" />
                </div>
                <div>
                  <div className="cu-card-label">Working Hours</div>
                  <p className="cu-card-value">Mon – Sat, 9 AM – 7 PM</p>
                </div>
              </div>

              {/* MAP */}
              <div className="cu-map-wrap">
                <iframe
                  title="Store location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.33750346623!2d-73.97968099999999!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1694259649153!5m2!1sen!2sbd"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Google Maps location"
                />
              </div>

            </aside>

            {/* ── RIGHT: FORM ── */}
            <div className="cu-form-card" role="main">

              <div className="cu-form-header">
                <p>Send a message</p>
                <h2>We reply within 24 hours</h2>
              </div>

              <div className="cu-form-body">
                <form onSubmit={handleSubmit} noValidate aria-label="Contact form">

                  <div className="cu-field-grid">

                    {/* Name */}
                    <div className="cu-field">
                      <label htmlFor="cu-name">
                        Your Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cu-name"
                        name="name"
                        type="text"
                        className={`cu-input${errors.name ? " error" : ""}`}
                        placeholder="Rahul Sharma"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        aria-required="true"
                        aria-describedby={errors.name ? "err-name" : undefined}
                      />
                      {errors.name && <span id="err-name" className="cu-error-msg" role="alert">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="cu-field">
                      <label htmlFor="cu-email">
                        Email Address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cu-email"
                        name="email"
                        type="email"
                        className={`cu-input${errors.email ? " error" : ""}`}
                        placeholder="rahul@email.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        aria-required="true"
                        aria-describedby={errors.email ? "err-email" : undefined}
                      />
                      {errors.email && <span id="err-email" className="cu-error-msg" role="alert">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="cu-field">
                      <label htmlFor="cu-phone">Phone Number</label>
                      <input
                        id="cu-phone"
                        name="phone"
                        type="tel"
                        className="cu-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                      />
                    </div>

                    {/* Project */}
                    <div className="cu-field">
                      <label htmlFor="cu-project">Your Project</label>
                      <input
                        id="cu-project"
                        name="project"
                        type="text"
                        className="cu-input"
                        placeholder="e.g. Bulk order, Custom design"
                        value={form.project}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Subject */}
                    <div className="cu-field full">
                      <label htmlFor="cu-subject">Subject</label>
                      <input
                        id="cu-subject"
                        name="subject"
                        type="text"
                        className="cu-input"
                        placeholder="What's this about?"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Message */}
                    <div className="cu-field full">
                      <label htmlFor="cu-message">
                        Your Message <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="cu-message"
                        name="message"
                        className={`cu-input cu-textarea${errors.message ? " error" : ""}`}
                        placeholder="Tell us what you have in mind..."
                        value={form.message}
                        onChange={handleChange}
                        aria-required="true"
                        aria-describedby={errors.message ? "err-message" : undefined}
                      />
                      {errors.message && <span id="err-message" className="cu-error-msg" role="alert">{errors.message}</span>}
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="cu-submit"
                    disabled={sending}
                    aria-busy={sending}
                  >
                    {sending ? (
                      <>
                        <span className="cu-spinner" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane" aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </button>

                  {sent && (
                    <div className="cu-success" role="status" aria-live="polite">
                      <div className="cu-success-icon" aria-hidden="true">
                        <i className="fas fa-check" />
                      </div>
                      <p>Message sent! We'll get back to you within 24 hours.</p>
                    </div>
                  )}

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;