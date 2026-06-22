import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Topbar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    toast.success("Admin Logout Successfully...!")

    setTimeout(() => {
      navigate("/admin/login")
    }, 1000)

  }

  return (
    <nav className="navbar bg-white shadow-sm px-3">

      {/* MOBILE OFFCANVAS BUTTON */}
      <button
        className="btn btn-outline-dark d-lg-none me-2"
        data-bs-toggle="offcanvas"
        data-bs-target="#adminSidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* DESKTOP COLLAPSE BUTTON */}
      <button
        className="btn btn-outline-secondary d-none d-lg-inline me-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
      </button>

      <span className="navbar-brand fw-semibold">
        Admin Dashboard
      </span>

      <button className="btn btn-outline-danger btn-sm ms-auto" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-1"></i>
        Logout
      </button>
    </nav>
  );
};

export default Topbar;
