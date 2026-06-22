import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../services/BaseUrl";
import toast from "react-hot-toast";

const AdminPendingOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH PENDING ORDERS ================= */
    const fetchPendingOrders = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                toast.error("Admin not logged in");
                navigate("/admin/login");
                return;
            }

            const res = await axios.get(
                `${BASE_URL}/api/admin/order/pending-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(res.data.orders);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load pending orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <h5>Loading pending orders...</h5>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="container">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold">📦 Pending Orders</h3>
                    <span className="badge bg-warning text-dark fs-6">
                        {orders.length} Pending
                    </span>
                </div>

                {/* EMPTY */}
                {orders.length === 0 ? (
                    <div className="alert alert-success text-center">
                        🎉 No pending orders
                    </div>
                ) : (
                    <div className="table-responsive shadow-sm rounded">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Order ID</th>
                                    <th>User</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td>{index + 1}</td>
                                        <td className="text-truncate" style={{ maxWidth: 160 }}>
                                            {order._id}
                                        </td>
                                        <td>
                                            <div className="fw-semibold">
                                                {order.user?.email || "Guest"}
                                            </div>
                                        </td>
                                        <td>₹{order.totalAmount}</td>
                                        <td>
                                            <span className="badge bg-warning text-dark">
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/order/${order._id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                View
                                                {/* onClick={() =>
                                                    navigate(`/admin/order/${order._id}`)
                                                } */}

                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPendingOrders;
