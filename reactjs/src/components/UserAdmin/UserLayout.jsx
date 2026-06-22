import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";

const UserLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="container-fluid p-0 min-vh-100">
      <div className="row g-0 min-vh-100">

        {/* ===== DESKTOP SIDEBAR ===== */}
        <div className="d-none d-lg-block col-lg-2 bg-light border-end">
          <UserSidebar />
        </div>

        {/* ===== MOBILE SIDEBAR (OFFCANVAS STYLE) ===== */}
        {showSidebar && (
          <div
            className="position-fixed top-0 start-0 h-100 bg-light shadow"
            style={{ width: "260px", zIndex: 1050 }}
          >
            <UserSidebar onClose={() => setShowSidebar(false)} />
          </div>
        )}

        {/* BACKDROP */}
        {showSidebar && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* ===== MAIN CONTENT ===== */}
        <div className="col d-flex flex-column">

          {/* TOPBAR */}
          <UserTopbar toggleSidebar={() => setShowSidebar(true)} />

          {/* PAGE CONTENT */}
          <main className="flex-grow-1 p-3 p-md-4 bg-body">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default UserLayout;
