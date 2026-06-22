import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios'

const HeroNavbar = () => {
  const navigate = useNavigate();
  const { userToken, logout, cartCount } = useAuth();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80); // 80px ke baad sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const getMainAllCategory = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:8080/api/category/get-main-category"
      );
      // console.log("my data is", data)

      if (data.success) {
        setCategories(data.data);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMainAllCategory();
  }, [])


  const handleLogout = () => {
    logout();
    // context state clear
    navigate("/login");
  };


  return (
    <>
      <Toaster />

      <div className={`container-fluid p-0 hero-navbar ${isSticky ? "sticky" : ""}`}>
        <div className="row gx-0 bg-primary px-3 px-lg-5 align-items-center position-relative">

          {/* ================= LEFT CATEGORY BAR ================= */}

          <div className="col-lg-3 d-none d-lg-block position-relative">
            <button
              className="btn text-white fw-bold w-100 text-start"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <i className="fa fa-bars me-2"></i> All Categories
            </button>

            {categoryOpen && (
              <ul className="category-dropdown list-unstyled">
                {loading ? (
                  <li className="px-3 py-2 text-muted">Loading...</li>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <a href={`/shops`}>
                        {cat.name}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-muted">
                    No categories found
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* ================= RIGHT NAVBAR ================= */}
          <div className="col-12 col-lg-9">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

              {/* LOGO (MOBILE) */}
              <Link className="navbar-brand d-lg-none" to="/">
                Electro
              </Link>

              {/* TOGGLER */}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="mainNavbar">

                <ul className="navbar-nav fw-bold ms-auto">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/shops" className="nav-link">Shop</Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link to="/product-details" className="nav-link">Product-details-page</Link>
                  </li> */}

                  <li className="nav-item dropdown">
                    <span
                      className="nav-link dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Pages
                    </span>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/best-seller">Bestseller</Link></li>
                      <li><Link className="dropdown-item" to="/cart">Cart</Link></li>
                      {/* <li><Link className="dropdown-item" to="/checkout">Checkout</Link></li> */}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link to="/contact-us" className="nav-link">Contact</Link>
                  </li>

                  <li className="nav-item position-relative">
                    <Link to="/cart" className="nav-link position-relative">
                      <i className="fas fa-shopping-cart text-light fs-5"></i>

                      {/* CART COUNT BADGE */}
                      {cartCount > 0 && (
                        <span className="cart-badge">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>

                  <style>
                    {
                      `
    .cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #dc3545; /* red */
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  height: 18px;
  min-width: 18px;
  padding: 0 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

    `
                    }
                  </style>

                  {userToken ? (
                    <a
                      className=""
                    >
                      <Link to="/user/dashboard" className="nav-link"> <i class="bi bi-person-circle"></i> User Dashboard   </Link>
                    </a>


                  ) : (
                    /* 👉 LOGIN NAHI HAI */
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/login">
                          Login
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/register">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>



                {/* CALL BUTTON */}
                {/* <a
                  href="tel:+01234567890"
                  className="btn btn-secondary rounded-pill ms-lg-3 mt-3 mt-lg-0"
                >
                  <i className="fa fa-mobile-alt me-2"></i> +0123 456 7890
                </a> */}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <style>{`


.hero-navbar {
  position: relative;
  width: 100%;
  transition: all 0.3s ease;
  z-index: 1000;
}

.hero-navbar.sticky {
  position: fixed;
  top: 0;
  left: 0;
  background: #0d6efd; /* bootstrap primary */
  box-shadow: 0 2px 15px rgba(0,0,0,0.15);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}



.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
  padding: 10px 0;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.category-dropdown li {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.category-dropdown li a {
  text-decoration: none;
  color: #333;
}

.category-dropdown li:hover {
  background: #f5f5f5;
}

`}</style>

    </>
  );
};

export default HeroNavbar;
