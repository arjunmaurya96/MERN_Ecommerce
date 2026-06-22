import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const UserOrders = () => {

  const { id } = useParams();
  const [orders, setOrders] = useState([]);
//  const [orders, setOrders] = useState([]);          // original data
const [filteredOrders, setFilteredOrders] = useState([]); // UI data
const [status, setStatus] = useState("");

useEffect(() => {
  if (!status) {
    setFilteredOrders(orders);
  } else {
    const filtered = orders.filter((order) => {
      return (
        order.orderStatus === status ||
        order.paymentStatus === status
      );
    });

    setFilteredOrders(filtered);
  }
}, [status, orders]);
  /* =============================
    GET USER ORDERS
  ============================= */

  const getUserOrders = async () => {
    try {

      const token = localStorage.getItem("adminToken");

      const { data } = await axios.get(
        `https://mern-ecommerce-zt4z.onrender.com/api/admin/user/user-orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders);
      }

    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="container-fluid py-4">

      <Toaster />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h4 className="fw-bold mb-0">
          User Orders
        </h4>

        <select value={status} onChange={() => e.target.value} className="form-control w-25 text-start" name="" id="">
          <option value="">--Select Status--</option>
          <option value="PLACED">	PLACED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <Link
          to="/admin/all-users"
          className="btn btn-secondary"
        >
          ← Back
        </Link>

      </div>


      {/* ORDER TABLE */}

      <div className="card shadow-sm border-0">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order._id}>

                    <td>{index + 1}</td>

                    <td>
                      <span className="fw-semibold">
                        {order._id.slice(-6)}
                      </span>
                    </td>

                    <td>
                      {order.items.length} Items
                    </td>

                    <td>
                      ₹{order.totalAmount}
                    </td>

                    {/* PAYMENT */}

                    <td>
                      {order.paymentStatus === "PAID" ? (
                        <span className="badge bg-success">
                          Paid
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* ORDER STATUS */}

                    <td>

                      <span
                        className={`badge 
                          ${order.orderStatus === "DELIVERED"
                            ? "bg-success"
                            : order.orderStatus === "CANCELLED"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                      >
                        {order.orderStatus}
                      </span>

                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION */}

                    <td className="text-end">

                      <Link
                        to={`/admin/order/${order._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default UserOrders;