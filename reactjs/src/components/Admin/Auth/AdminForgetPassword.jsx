import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://mern-ecommerce-zt4z.onrender.com/api/admin/forget-password",
        { email }
      );

      console.log("my link is here", res)
      toast.success(res?.data?.message || "Reset link generated");

      // ✅ token extract
      const resetLink = res?.data?.resetUrl;
      if (resetLink) {
        const token = resetLink.split("/admin/reset-password/")[1];
        setResetToken(token); // 🔥 THIS HIDES INPUT & SHOWS LINK
      }

      setEmail("");

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Toaster position="top-right" />

      <div className="col-11 col-sm-9 col-md-6 col-lg-4 col-xl-3">
        <div className="card shadow-lg border-0 rounded-4">

          {/* Header */}
          <div className="bg-dark text-white text-center py-4 rounded-top-4">
            <h5 className="fw-semibold mb-0">Admin Password Recovery</h5>
            <small className="opacity-75">Secure access recovery</small>
          </div>

          <div className="card-body p-4 text-center">

            {/* 🔥 AFTER SUBMIT */}
            {resetToken ? (
              <>
                <p className="text-success fw-semibold mb-3">
                  Reset link generated successfully 🎉
                </p>

                <Link
                  to={`/admin/reset-password/${resetToken}`}
                  className="btn btn-outline-primary w-100 mb-2"
                >
                  Go to Reset Password
                </Link>

                <button
                  onClick={() => navigate("/admin/login")}
                  className="btn btn-link w-100 text-decoration-none"
                >
                  Back to Admin Login
                </button>
              </>
            ) : (
              /* 🔹 BEFORE SUBMIT */
              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-start">
                  <label className="form-label fw-semibold">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your registered Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <small className="text-muted">
                    We’ll send a secure reset link
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="btn btn-link w-100 mt-3 text-decoration-none text-secondary"
                >
                  ← Back to Admin Login
                </button>
              </form>
            )}

          </div>
        </div>

        <p className="text-center text-muted mt-4 small">
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminForgetPassword;
