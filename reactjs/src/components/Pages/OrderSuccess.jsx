import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroNavbar from "./HeroNavbar";
import axios from "axios";
import { BASE_URL } from "../../services/BaseUrl";
import toast from "react-hot-toast";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/api/order/get/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data.order);
      } catch (error) {
        console.error("Order fetch error:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <>
        <HeroNavbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-success mb-3"></div>
          <h5>Loading order details...</h5>
        </div>
      </>
    );
  }

  /* ================= NO ORDER ================= */
  if (!order) {
    return (
      <>
        <HeroNavbar />
        <div className="container py-5 text-center">
          <h4>No order found</h4>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroNavbar />

      <div className="container py-5">

        {/* ================= SUCCESS HEADER ================= */}
        <div className="text-center mb-5">
          <div className="display-6 text-success fw-bold mb-2">
            🎉 Order Confirmed
          </div>
          <p className="text-muted">
            Thank you for your purchase!
          </p>
          <span className="badge bg-success px-4 py-2">
            Order ID: {order._id}
          </span>
        </div>

        <div className="row g-4">

          {/* ================= LEFT SECTION ================= */}
          <div className="col-12 col-lg-7">

            {/* BILLING */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header fw-bold">
                Billing Details
              </div>
              <div className="card-body">
                <p className="mb-1">
                  <b>Name:</b>{" "}
                  {order.billingAddress.firstName}{" "}
                  {order.billingAddress.lastName}
                </p>
                <p className="mb-1">
                  <b>Address:</b> {order.billingAddress.address}
                </p>
                <p className="mb-1">
                  <b>City:</b> {order.billingAddress.city}
                </p>
                <p className="mb-1">
                  <b>Country:</b> {order.billingAddress.country}
                </p>
                <p className="mb-1">
                  <b>Mobile:</b> {order.billingAddress.mobile}
                </p>
                <p className="mb-1">
                  <b>Email:</b> {order.billingAddress.email}
                </p>

                {order.billingAddress.notes && (
                  <p className="mb-0">
                    <b>Notes:</b> {order.billingAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* ITEMS */}
            <div className="card shadow-sm">
              <div className="card-header fw-bold">
                Order Items
              </div>

              <div className="table-responsive">
                <table className="table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {item.product?.name || item.product}
                        </td>
                        <td className="text-center">
                          {item.qty}
                        </td>
                        <td className="text-end">
                          ₹{item.price}
                        </td>
                        <td className="text-end">
                          ₹{item.price * item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm sticky-top" style={{ top: "100px" }}>
              <div className="card-header fw-bold">
                Order Summary
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>₹{order.shippingCharge}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>

                <div className="mt-3">
                  <p className="mb-1">
                    <b>Payment:</b> {order.paymentMethod}
                  </p>
                  <p className="mb-0">
                    <b>Status:</b>{" "}
                    <span className="badge bg-success">
                      {order.orderStatus}
                    </span>
                  </p>
                </div>

                <button
                  className="btn btn-primary w-100 mt-4"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
