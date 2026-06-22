import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ViewUserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const { data } = await axios.get(
        `https://mern-ecommerce-zt4z.onrender.com/api/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Toaster />

      {/* Top Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <Link to="/admin/all-users" className="btn btn-secondary">
          ← Back
        </Link>

        <Link
          to={`/admin/user-orders/${user._id}`}
          className="btn btn-primary"
        >
          View Orders
        </Link>
      </div>

      {/* USER PROFILE CARD */}
      <div className="card shadow border-0">

        <div className="card-body">

          <div className="row align-items-center">

            {/* Avatar */}
            <div className="col-md-3 text-center mb-3 mb-md-0">
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <h5 className="mt-3 mb-0">{user.name}</h5>
              <small className="text-muted">{user.email}</small>
            </div>

            {/* User Info */}
            <div className="col-md-9">

              <div className="row g-3">

                <div className="col-md-6">
                  <strong>Mobile</strong>
                  <div className="text-muted">
                    {user.mobile || "Not provided"}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>Role</strong>
                  <div className="text-muted text-capitalize">
                    {user.role}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>Status</strong>
                  <div>
                    {user.isBlocked ? (
                      <span className="badge bg-danger">
                        Blocked
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <strong>Joined Date</strong>
                  <div className="text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="col-12">
                  <strong>User ID</strong>
                  <div className="text-muted">
                    {user._id}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ViewUserDetails;