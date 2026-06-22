import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../../services/BaseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDeliveredOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DELIVERED ORDERS ================= */
  const fetchDeliveredOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin not logged in");
        navigate("/admin/login");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/admin/order/get-delivered`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load delivered orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="container py-5">Loading delivered orders...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Delivered Orders</h3>
        <span className="badge bg-success fs-6">
          Total: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          No delivered orders found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr className="text-center">
                <th>#</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivered On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="text-center">
                  <td>{index + 1}</td>
                  <td className="text-break">{order._id}</td>
                  <td>
                    <div className="fw-semibold">
                      {order.user?.name || "N/A"}
                    </div>
                    <small className="text-muted">
                      {order.user?.email}
                    </small>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.paymentStatus === "PAID"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        navigate(`/admin/order/${order._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveredOrders;
