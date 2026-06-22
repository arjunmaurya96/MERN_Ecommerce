import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  console.log("my data", formData)

  // 🔒 Token safety check
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const res = await axios.post(
        `http://localhost:8080/api/reset-password/${token}`, 
        { password }
      );

      console.log("RESET PASSWORD RESPONSE:", res.data);

      toast.success(res?.data?.message || "Password reset successful");

      setFormData({
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

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
                  src="https://dummyimage.com/160x50/000/fff&text=RESET"
                  alt="Reset Logo"
                  className="img-fluid mb-2"
                />
                <h5 className="fw-bold mb-0">Reset Password</h5>
                <small className="text-muted">
                  Create a new secure password
                </small>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Reset Password
                </button>

              </form>
            </div>
          </div>

          <p className="text-center text-muted mt-3 mb-0">
            © {new Date().getFullYear()} User Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
