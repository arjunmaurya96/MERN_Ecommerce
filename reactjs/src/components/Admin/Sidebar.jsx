import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarContent = ({ collapsed, closeOnClick }) => {
  const location = useLocation();

  // submenu state
  const [openMenu, setOpenMenu] = useState(() => {
    if (location.pathname.startsWith("/admin/products")) return "products";
    if (location.pathname.startsWith("/admin/categories")) return "categories";
    if (location.pathname.startsWith("/admin/orders")) return "orders";
    return "";
  });

  const isActive = (path) =>
    location.pathname === path ? "active bg-primary" : "";

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="w-100">

      {/* LOGO */}
      <div className="text-center py-3 border-bottom">
        <img
          src="https://dummyimage.com/140x40/ffffff/000000&text=ADMIN"
          alt="Admin Logo"
          className="img-fluid"
        />
      </div>

      <ul className="nav nav-pills flex-column w-100 px-2 mt-3 gap-1">

        {/* DASHBOARD */}
        <li className="nav-item">
          <Link
            to="/admin"
            onClick={closeOnClick}
            className={`nav-link d-flex align-items-center text-white ${isActive("/admin")}`}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            {!collapsed && "Dashboard"}
          </Link>
        </li>

        {/* PRODUCTS */}
        <li className="nav-item">
          <button
            type="button"
            onClick={() => toggleMenu("products")}
            className="nav-link d-flex align-items-center w-100 text-white"
          >
            <i className="bi bi-box-seam me-2"></i>
            {!collapsed && (
              <>
                <span>Products</span>
                <i
                  className={`bi ms-auto ${openMenu === "products"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                    }`}
                ></i>
              </>
            )}
          </button>

          {openMenu === "products" && !collapsed && (
            <ul className="nav flex-column ms-4 mt-1">
              <li className="nav-item">
                <Link
                  to="/admin/products-list"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/products-list")}`}
                >
                  Product List
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/add-product"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/add-product")}`}
                >
                  Add Product
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* CATEGORIES */}
        <li className="nav-item">
          <button
            type="button"
            onClick={() => toggleMenu("categories")}
            className="nav-link d-flex align-items-center w-100 text-white"
          >
            <i className="bi bi-tags me-2"></i>
            {!collapsed && (
              <>
                <span>Categories</span>
                <i
                  className={`bi ms-auto ${openMenu === "categories"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                    }`}
                ></i>
              </>
            )}
          </button>

          {openMenu === "categories" && !collapsed && (
            <ul className="nav flex-column ms-4 mt-1">
              <li className="nav-item">
                <Link
                  to="/admin/category-list"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/category-list")}`}
                >
                  Category List
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/add-category"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/add-category")}`}
                >
                  Add Category
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* ================= ORDERS ================= */}
        <li className="nav-item">
          <button
            type="button"
            onClick={() => toggleMenu("orders")}
            className="nav-link d-flex align-items-center w-100 text-white"
          >
            <i className="bi bi-bag-check me-2"></i>
            {!collapsed && (
              <>
                <span>Orders</span>
                <i
                  className={`bi ms-auto ${openMenu === "orders"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                    }`}
                ></i>
              </>
            )}
          </button>

          {openMenu === "orders" && !collapsed && (
            <ul className="nav flex-column ms-4 mt-1">

              <li className="nav-item">
                <Link
                  to="/admin/orders"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/orders")}`}
                >
                  All Orders
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/pending-order"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/pending-order")}`}
                >
                  Pending Orders
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/admin/delivered-order"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("admin/delivered-order")}`}
                >
                  Delivered Orders
                </Link>
              </li>
            </ul>

          )}
        </li>

        <li className="nav-item">
          <button
            type="button"
            onClick={() => toggleMenu("users")}
            className="nav-link d-flex align-items-center w-100 text-white"
          >
            <i className="bi bi-people me-2"></i>

            {!collapsed && (
              <>
                <span>Users</span>

                <i
                  className={`bi ms-auto ${openMenu === "users"
                    ? "bi-chevron-up"
                    : "bi-chevron-down"
                    }`}
                ></i>
              </>
            )}
          </button>

          {openMenu === "users" && !collapsed && (
            <ul className="nav flex-column ms-4 mt-1">

              {/* All Users */}
              <li className="nav-item">
                <Link
                  to="/admin/all-users"
                  onClick={closeOnClick}
                  className={`nav-link text-white ${isActive("/admin/all-users")}`}
                >
                  All Users
                </Link>
              </li>


            </ul>
          )}
        </li>

      </ul>
    </div>
  );
};

const Sidebar = ({ collapsed, variant }) => {
  /* DESKTOP */
  if (variant === "desktop") {
    return (
      <div className="bg-dark text-white h-100 w-100">
        <SidebarContent collapsed={collapsed} />
      </div>
    );
  }

  /* MOBILE / TABLET OFFCANVAS */
  return (
    <div
      className="offcanvas offcanvas-start bg-dark text-white"
      tabIndex="-1"
      id="adminSidebar"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">Admin Panel</h5>
        <button
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      <div className="offcanvas-body p-0">
        <SidebarContent closeOnClick />
      </div>
    </div>
  );
};

export default Sidebar;
