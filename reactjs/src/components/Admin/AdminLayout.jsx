import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">

        {/* ===== DESKTOP SIDEBAR ===== */}
        <div
          className={`d-none d-lg-flex bg-dark ${
            collapsed ? "col-lg-1" : "col-lg-2"
          }`}
        >
          <Sidebar collapsed={collapsed} variant="desktop" />
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="col d-flex flex-column bg-light">

          {/* TOPBAR */}
          <Topbar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          {/* PAGE CONTENT */}
          <main className="flex-grow-1 p-3 p-md-4">
            <Outlet />
          </main>

        </div>

        {/* ===== MOBILE / TABLET OFFCANVAS ===== */}
        <Sidebar variant="offcanvas" />

      </div>
    </div>
  );
};

export default AdminLayout;
