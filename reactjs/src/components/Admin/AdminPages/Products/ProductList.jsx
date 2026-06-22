import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080/api/product";
const FALLBACK_IMG = "https://dummyimage.com/60x60/e2e8f0/94a3b8&text=No+Img";
const FALLBACK_PREVIEW = "https://dummyimage.com/600x600/e2e8f0/94a3b8&text=No+Image";

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge = ({ variant = "default", children }) => {
  const variants = {
    success: { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
    danger:  { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" },
    warning: { bg: "#fef9c3", color: "#a16207", border: "#fde68a" },
    info:    { bg: "#dbeafe", color: "#1d4ed8", border: "#bfdbfe" },
    default: { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  };
  const s = variants[variant] || variants.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: 9999,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {children}
    </span>
  );
};

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 10 }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div style={{
          height: i === 1 ? 44 : 16, width: i === 1 ? 44 : "80%",
          borderRadius: i === 1 ? 8 : 4,
          background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }} />
      </td>
    ))}
  </tr>
);

const EmptyState = ({ query }) => (
  <tr>
    <td colSpan={10}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 12, padding: "48px 16px", color: "#94a3b8",
      }}>
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#64748b" }}>
          {query ? `No results for "${query}"` : "No products yet"}
        </p>
        <p style={{ margin: 0, fontSize: 13 }}>
          {query ? "Try a different search term." : "Add your first product to get started."}
        </p>
        {!query && (
          <Link to="/admin/add-product" style={{
            marginTop: 4, padding: "8px 20px", borderRadius: 8,
            background: "#3b82f6", color: "#fff", fontSize: 13,
            fontWeight: 600, textDecoration: "none",
          }}>
            + Add Product
          </Link>
        )}
      </div>
    </td>
  </tr>
);

const ImagePreviewModal = ({ image, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 24,
          background: "rgba(255,255,255,0.12)", border: "none",
          color: "#fff", borderRadius: "50%", width: 36, height: 36,
          fontSize: 20, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >
        ×
      </button>
      <img
        src={image?.url || FALLBACK_PREVIEW}
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: "88vh", maxWidth: "88vw",
          objectFit: "contain", borderRadius: 12,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductList = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [deleting, setDeleting]         = useState(null);   // product _id being deleted
  const [previewImage, setPreviewImage] = useState(null);   // { url, public_id }
  const [searchQuery, setSearchQuery]   = useState("");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/get-product`);
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    try {
      setDeleting(id);
      const { data } = await axios.delete(`${API_BASE}/delete-product/${id}`);
      if (data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .pl-table tbody tr:hover { background: #f8fafc; }
        .pl-img-thumb:hover      { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
        .pl-btn:disabled         { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      {/* ── Header bar ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12,
        alignItems: "center", justifyContent: "space-between",
        marginBottom: 20,
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: 20, color: "#0f172a" }}>
            Products
          </h4>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#94a3b8" }}>
            {loading ? "Loading…" : `${products.length} total · ${filtered.length} shown`}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: 32, paddingRight: searchQuery ? 32 : 12,
                paddingTop: 8, paddingBottom: 8,
                border: "1px solid #e2e8f0", borderRadius: 8,
                fontSize: 13, outline: "none", color: "#0f172a",
                background: "#fff", minWidth: 220,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e)  => (e.target.style.borderColor = "#e2e8f0")}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", fontSize: 16, lineHeight: 1, padding: 0,
                }}
              >×</button>
            )}
          </div>

          {/* Add button */}
          <Link
            to="/admin/add-product"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8,
              background: "#3b82f6", color: "#fff",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 1px 4px rgba(59,130,246,0.35)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Product
          </Link>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={{
        background: "#fff", borderRadius: 12,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table
            className="pl-table"
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["#","Image","Product","Category","Price","Stock","Featured","Status","Created","Actions"]
                  .map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        fontWeight: 600, fontSize: 11.5,
                        color: "#64748b", letterSpacing: "0.05em",
                        textTransform: "uppercase", whiteSpace: "nowrap",
                        textAlign: i === 9 ? "right" : "left",
                      }}
                    >{h}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <EmptyState query={searchQuery} />
              ) : (
                filtered.map((product, index) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background 0.1s",
                    }}
                  >
                    {/* # */}
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontWeight: 500 }}>
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={product.images?.[0]?.url || FALLBACK_IMG}
                        alt={product.name}
                        className="pl-img-thumb"
                        onClick={() => setPreviewImage(product.images?.[0] || { url: FALLBACK_PREVIEW })}
                        style={{
                          width: 44, height: 44, objectFit: "cover",
                          borderRadius: 8, border: "1px solid #e2e8f0",
                          cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
                          display: "block",
                        }}
                      />
                    </td>

                    {/* Product name + desc */}
                    <td style={{ padding: "12px 16px", maxWidth: 220 }}>
                      <div style={{ fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap",
                                    overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2,
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.description?.slice(0, 45) || "—"}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "12px 16px", color: "#475569", whiteSpace: "nowrap" }}>
                      {product.category?.name || "—"}
                    </td>

                    {/* Price */}
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                      {product.discountPrice > 0 && (
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                          <s>₹{product.discountPrice?.toLocaleString()}</s>
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td style={{ padding: "12px 16px" }}>
                      {product.stock > 0
                        ? <Badge variant="info">{product.stock}</Badge>
                        : <Badge variant="danger">Out</Badge>}
                    </td>

                    {/* Featured */}
                    <td style={{ padding: "12px 16px" }}>
                      {product.isFeatured
                        ? <Badge variant="warning">Yes</Badge>
                        : <Badge variant="default">No</Badge>}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 16px" }}>
                      <Badge variant={product.status === "active" ? "success" : "default"}>
                        {product.status}
                      </Badge>
                    </td>

                    {/* Created */}
                    <td style={{ padding: "12px 16px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {new Date(product.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="pl-btn"
                        style={{
                          display: "inline-flex", alignItems: "center",
                          padding: "5px 14px", borderRadius: 7,
                          fontSize: 12, fontWeight: 600, marginRight: 6,
                          background: "#fef9c3", color: "#a16207",
                          border: "1px solid #fde68a", textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fde68a")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fef9c3")}
                      >
                        Edit
                      </Link>
                      <button
                        className="pl-btn"
                        onClick={() => deleteProduct(product._id)}
                        disabled={deleting === product._id}
                        style={{
                          display: "inline-flex", alignItems: "center",
                          padding: "5px 14px", borderRadius: 7,
                          fontSize: 12, fontWeight: 600,
                          background: "#fee2e2", color: "#dc2626",
                          border: "1px solid #fecaca", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { if (deleting !== product._id) e.currentTarget.style.background = "#fecaca"; }}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
                      >
                        {deleting === product._id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Result count footer */}
        {!loading && filtered.length > 0 && (
          <div style={{
            padding: "10px 16px", borderTop: "1px solid #f1f5f9",
            fontSize: 12, color: "#94a3b8", display: "flex", justifyContent: "space-between",
          }}>
            <span>Showing <strong style={{ color: "#475569" }}>{filtered.length}</strong> of <strong style={{ color: "#475569" }}>{products.length}</strong> products</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", color: "#3b82f6",
                         fontSize: 12, cursor: "pointer", padding: 0, fontWeight: 500 }}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Image preview modal ── */}
      {previewImage && (
        <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </>
  );
};

export default ProductList;