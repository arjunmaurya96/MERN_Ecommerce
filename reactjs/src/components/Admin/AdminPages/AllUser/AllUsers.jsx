import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    /* =============================
       GET ALL USERS
    ============================= */
    const getUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const { data } = await axios.get(
                "https://mern-ecommerce-zt4z.onrender.com/api/admin/user/all-user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    /* =============================
       BLOCK / UNBLOCK USER
    ============================= */
    const toggleBlock = async (id, status) => {
        try {
            const token = localStorage.getItem("adminToken");

            const { data } = await axios.put(
                `https://mern-ecommerce-zt4z.onrender.com/api/admin/user/block-user/${id}`,
                { isBlocked: !status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success("User status updated");
                getUsers();
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    /* =============================
       SEARCH FILTER
    ============================= */

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <Toaster />

            {/* HEADER */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h4 className="fw-bold">All Users</h4>
                </div>

                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id}>

                                        <td>{index + 1}</td>

                                        <td className="fw-semibold">
                                            {user.name}
                                        </td>

                                        <td>{user.email}</td>

                                        <td>{user.mobile || "—"}</td>

                                        {/* STATUS */}
                                        <td>
                                            {user.isBlocked ? (
                                                <span className="badge bg-danger">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        {/* JOIN DATE */}
                                        <td>
                                            <small>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </small>
                                        </td>

                                        {/* ACTION */}
                                        <td className="text-end">

                                            <Link
                                                to={`/admin/user-details/${user._id}`}
                                                className="btn btn-sm btn-info me-2"
                                            >
                                                View
                                            </Link>

                                            <button
                                                className={`btn btn-sm ${user.isBlocked
                                                        ? "btn-success"
                                                        : "btn-danger"
                                                    }`}
                                                onClick={() =>
                                                    toggleBlock(user._id, user.isBlocked)
                                                }
                                            >
                                                {user.isBlocked ? "Unblock" : "Block"}
                                            </button>

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

export default AllUsers;