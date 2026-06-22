import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(""); // ✅ token only

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/forget-password", // ✅ FIXED API
        { email }
      );

      console.log("FORGET PASSWORD RESPONSE:", res.data);

      toast.success(
        res?.data?.message ||
        "Password reset link generated successfully"
      );

      // 🔥 TOKEN EXTRACT FROM RESET LINK
      const link = res?.data?.resetLink;
      const token = link.split("/reset-password/")[1];

      setResetToken(token); // ✅ store token only
      setEmail("");

    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Toaster />
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-9 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              {/* Header */}
              <div className="text-center mb-4">
                <img
                  src="https://dummyimage.com/160x50/000/fff&text=USER"
                  alt="User Logo"
                  className="img-fluid mb-2"
                />
                <h5 className="fw-bold mb-0">Forgot Password</h5>
                <small className="text-muted">
                  Enter your email to receive a reset link
                </small>
              </div>

              {/* ✅ RESET LINK VIEW */}
              {resetToken ? (
                <div className="text-center">
                  <p className="text-success fw-semibold">
                    Reset link generated successfully 🎉
                  </p>

                  <Link
                    to={`/reset-password/${resetToken}`} // ✅ CORRECT
                    className="btn btn-outline-primary w-100"
                  >
                    Go to Reset Password
                  </Link>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="btn btn-link w-100 mt-2 text-decoration-none"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                /* 🔹 FORM */
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Send Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="btn btn-link w-100 mt-2 text-decoration-none"
                  >
                    Back to Login
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-muted mt-3 mb-0">
            © {new Date().getFullYear()} User Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
