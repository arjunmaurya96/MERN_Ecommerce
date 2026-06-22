import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); 

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔥 BACKEND API CALL
      const res = await axios.post(
        `https://mern-ecommerce-zt4z.onrender.com/api/admin/reset-password/${token}`,
        { password, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res?.data?.message || "Password reset successfully");

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Toaster position="top-right" />

      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4">

            {/* Header */}
            <div className="card-header bg-primary text-white text-center rounded-top-4 py-4">
              <h4 className="fw-bold mb-1">Reset Password</h4>
              <p className="mb-0 small">Secure your admin account</p>
            </div>

            {/* Body */}
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-lg"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="card-footer text-center bg-white border-0 pb-4">
              <small className="text-muted">
                Make sure your password is strong & secure
              </small>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
