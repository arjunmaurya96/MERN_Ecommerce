import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/BaseUrl";
import toast from "react-hot-toast";

const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= TRACK ORDER ================= */
  const handleTrackOrder = async () => {
    if (!orderId) {
      toast.error("Please enter Order ID");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);
      setOrder(null);

      const res = await axios.get(
        `${BASE_URL}/api/order/get/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(res.data.order);
      toast.success("Order found");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Order not found"
      );
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = (step) =>
    steps.indexOf(step) <= steps.indexOf(order?.orderStatus);

  return (
    <div className="container-fluid p-0">

      {/* ===== HEADER ===== */}
      <div className="mb-4 text-center">
        <h4 className="fw-semibold">Track Your Order</h4>
        <p className="text-muted mb-0">
          Enter your Order ID to see live status
        </p>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleTrackOrder}
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
        </div>
      </div>

      {/* ===== ORDER DETAILS ===== */}
      {order && (
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* ===== STATUS TIMELINE ===== */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-semibold mb-3">
                  Order Status
                </h6>

                {order.orderStatus === "CANCELLED" ? (
                  <div className="text-danger fw-semibold text-center">
                    ❌ This order has been cancelled
                  </div>
                ) : (
                  <div className="row text-center g-2">
                    {steps.map((step) => (
                      <div className="col" key={step}>
                        <div
                          className={`mx-auto rounded-circle mb-2 ${
                            isCompleted(step)
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                          style={{ width: 14, height: 14 }}
                        />
                        <small
                          className={
                            isCompleted(step)
                              ? "fw-semibold"
                              : "text-muted"
                          }
                        >
                          {step}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== ORDER SUMMARY ===== */}
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">
                Order Summary
              </div>

              <div className="card-body">
                <p className="mb-1">
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="mb-1">
                  <strong>Placed On:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mb-3">
                  <strong>Payment:</strong>{" "}
                  {order.paymentMethod}
                </p>

                <h6 className="fw-semibold mb-3">
                  Items
                </h6>

                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item._id}>
                          <td>
                            {item.product?.name ||
                              item.product}
                          </td>
                          <td>{item.qty}</td>
                          <td>₹{item.price}</td>
                          <td>
                            ₹{item.price * item.qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-semibold">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
