import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { BASE_URL } from "../../services/BaseUrl";
import { BASE_URL } from "../../../services/BaseUrl";
import toast from "react-hot-toast";

const Dashboard = () => {

  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          toast.error("Admin not logged in");
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data.stats);
        setLatestOrders(res.data.latestOrders);

      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1">Admin Dashboard</h4>
          <small className="text-muted">
            Monitor users, orders & revenue
          </small>
        </div>

        <Link to="/" className="btn btn-outline-primary btn-sm">
          Go to Website
        </Link>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row g-3 mb-4">
        <KpiCard title="Total Users" value={stats.totalUsers} color="dark" note="Registered users" />
        <KpiCard title="Total Orders" value={stats.totalOrders} color="primary" note="All time" />
        <KpiCard title="Pending Orders" value={stats.pendingOrders} color="warning" note="Needs action" />
        <KpiCard title="Delivered Orders" value={stats.deliveredOrders} color="success" note="Completed" />
        <KpiCard title="Today Orders" value={stats.todayOrders} color="info" note="Last 24 hours" />
        <KpiCard title="Today Revenue" value={`₹${stats.todayRevenue}`} color="secondary" note="Today sales" />
        <KpiCard title="Total Revenue" value={`₹${stats.totalRevenue}`} color="success" note="Overall" />
      </div>

      {/* ================= ORDER STATUS OVERVIEW ================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Order Status Overview</h5>

          <div className="row g-3 text-center">
            <StatusBox title="Placed" value={stats.pendingOrders} />
            <StatusBox title="Delivered" value={stats.deliveredOrders} />
          </div>
        </div>
      </div>

      {/* ================= LATEST ORDERS TABLE ================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">Latest Orders</h5>
            <Link to="/admin/orders" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {latestOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.user?.name}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/admin/order/${order._id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Quick Actions</h5>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/add-product" className="btn btn-primary">
              + Add Product
            </Link>

            <Link to="/admin/products-list" className="btn btn-outline-secondary">
              View Products
            </Link>

            <Link to="/admin/pending-order" className="btn btn-outline-warning">
              Pending Orders
            </Link>

            <Link to="/admin/delivered-order" className="btn btn-outline-success">
              Delivered Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

/* ================= KPI CARD ================= */
const KpiCard = ({ title, value, color, note }) => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h3 className={`fw-bold text-${color}`}>{value}</h3>
        <small className="text-muted">{note}</small>
      </div>
    </div>
  </div>
);

/* ================= STATUS BOX ================= */
const StatusBox = ({ title, value }) => (
  <div className="col-6 col-md-3">
    <div className="p-3 rounded bg-light">
      <h6 className="mb-1">{title}</h6>
      <span className="fw-bold">{value}</span>
    </div>
  </div>
);

/* ================= STATUS BADGE COLOR ================= */
const getStatusBadge = (status) => {
  switch (status) {
    case "PLACED":
      return "bg-warning";
    case "CONFIRMED":
      return "bg-info";
    case "SHIPPED":
      return "bg-primary";
    case "DELIVERED":
      return "bg-success";
    case "CANCELLED":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

export default Dashboard;
