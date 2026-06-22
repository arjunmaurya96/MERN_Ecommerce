import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../services/BaseUrl";
import toast, { Toaster } from "react-hot-toast";

const statusColor = (status) => {
  switch (status) {
    case "PLACED": return "secondary";
    case "CONFIRMED": return "primary";
    case "SHIPPED": return "info";
    case "DELIVERED": return "success";
    case "CANCELLED": return "danger";
    default: return "dark";
  }
};

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin not logged in");
        navigate("/admin/login");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/admin/order/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(res.data.order);
      setStatus(res.data.order.orderStatus);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin not logged in");
        navigate("/admin/login");
        return;
      }

      console.log("🔄 Updating status:", status);

      const res = await axios.put(
        `${BASE_URL}/api/admin/order/update-status/${orderId}`,
        {
          orderStatus: status, // BODY
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Status Updated Response:", res.data);
      toast.success(res?.data?.message)
      // toast.success("Order status updated successfully");

      // refresh order data
      fetchOrder();

    } catch (error) {
      console.error("❌ Update Status Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4>Order not found</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-5">
<Toaster/>
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Order Details</h3>
          <span className="text-muted">Order ID: {order._id}</span>
        </div>

        <span className={`badge bg-${statusColor(order.orderStatus)} fs-6`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-12 col-lg-8">

          {/* ORDER SUMMARY */}
          <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold">Order Summary</div>
            <div className="card-body row g-3">
              <div className="col-md-6">
                <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
                <p><b>Payment Method:</b> {order.paymentMethod}</p>
                <p>
                  <b>Payment Status:</b>{" "}
                  <span className={`badge bg-${order.paymentStatus === "PAID" ? "success" : "warning"}`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              <div className="col-md-6">
                <p><b>Subtotal:</b> ₹{order.subtotal}</p>
                <p><b>Shipping:</b> ₹{order.shippingCharge}</p>
                <p><b>Placed On:</b> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Ordered Items</div>
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.product?.name || item.product}</td>
                      <td>₹{item.price}</td>
                      <td>{item.qty}</td>
                      <td className="fw-bold">
                        ₹{item.price * item.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-12 col-lg-4">

          {/* CUSTOMER */}
          <div className="card shadow-sm mb-4">
            <div className="card-header fw-bold">Customer Details</div>
            <div className="card-body">
              <p><b>Name:</b> {order.billingAddress.firstName} {order.billingAddress.lastName}</p>
              <p><b>Email:</b> {order.billingAddress.email}</p>
              <p><b>Mobile:</b> {order.billingAddress.mobile}</p>
              <p><b>Address:</b> {order.billingAddress.address}</p>
              <p><b>City:</b> {order.billingAddress.city}</p>
              <p><b>Country:</b> {order.billingAddress.country}</p>
            </div>
          </div>

          {/* UPDATE STATUS */}
          <div className="card shadow-sm">
            <div className="card-header fw-bold">Update Order Status</div>
            <div className="card-body">
              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                className="btn btn-success w-100"
                onClick={updateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOrderDetails;
