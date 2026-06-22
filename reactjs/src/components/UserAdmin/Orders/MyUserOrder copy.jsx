import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/BaseUrl";
import { useNavigate } from "react-router-dom";

const MyUserOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `${BASE_URL}/api/dashboard/user/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===== HELPERS ===== */

  const badgeClass = (status) => {
    const map = {
      DELIVERED: "success",
      SHIPPED: "primary",
      CONFIRMED: "info",
      PLACED: "warning",
      CANCELLED: "danger",
    };
    return `badge bg-${map[status] || "secondary"}`;
  };

  const getProductImage = (product) => {
    if (product?.images?.length > 0) {
      return `${BASE_URL}${product.images[0]}`;
    }
    return "/img/no-image.png";
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <div className="py-4">
        {[1, 2].map((i) => (
          <div className="card mb-3" key={i}>
            <div className="card-body placeholder-glow">
              <span className="placeholder col-6"></span>
              <span className="placeholder col-4"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">

      {/* ===== HEADER ===== */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-0">My Orders</h4>
        <p className="text-muted mb-0">
          View and manage your recent orders
        </p>
      </div>

      {/* ===== EMPTY STATE ===== */}
      {orders.length === 0 ? (
        <div className="card text-center p-5 shadow-sm">
          <h5>No Orders Found</h5>
          <p className="text-muted mb-0">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        orders.map((order) => {
          const firstItem = order.items[0];
          const extraItems = order.items.length - 1;

          return (
            <div className="card shadow-sm mb-3" key={order._id}>
              <div className="card-body">
                <div className="row g-3 align-items-center">

                  {/* PRODUCT IMAGE */}
                  <div className="col-3 col-sm-2">
                    <img
                      src={getProductImage(firstItem.product)}
                      alt={firstItem.product.name}
                      className="img-fluid rounded border"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="col-9 col-sm-6">
                    <h6 className="fw-semibold mb-1">
                      {firstItem.product.name}
                    </h6>

                    {extraItems > 0 && (
                      <small className="text-muted d-block">
                        +{extraItems} more item{extraItems > 1 ? "s" : ""}
                      </small>
                    )}

                    <small className="text-muted d-block">
                      Order ID: {order._id}
                    </small>

                    <small className="text-muted">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </div>

                  {/* STATUS & PRICE */}
                  <div className="col-6 col-sm-2">
                    <span className={badgeClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                    <div className="fw-semibold mt-2">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="col-6 col-sm-2 text-end">
                    <button
                      className="btn btn-outline-primary btn-sm w-100 mb-2"
                      onClick={() =>
                        navigate(`/user/order-details/${order._id}`)
                      }
                    >
                      View Details
                    </button>

                    <button className="btn btn-outline-secondary btn-sm w-100 mb-2">
                      Invoice
                    </button>

                    {order.orderStatus === "DELIVERED" && (
                      <button className="btn btn-dark btn-sm w-100">
                        Re-Order
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyUserOrder;
