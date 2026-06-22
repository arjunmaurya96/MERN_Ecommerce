import React from "react";
import { useState } from "react";
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }


  const AdminSubmitData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://mern-ecommerce-zt4z.onrender.com/api/admin/login-admin", formData)

      console.log("my data iiii", response)
      toast.success(response?.data?.message)
      const token = response?.data?.token;
      localStorage.setItem("adminToken", token)
      setFormData({
        email: "",
        password: ""
      })

      setTimeout(() => {
        navigate('/admin')
      }, 1500)

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <Toaster />
        <div className="col-11 col-sm-9 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">

            {/* Header */}
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <img
                  src="https://dummyimage.com/160x50/000/fff&text=ADMIN"
                  alt="Admin Logo"
                  className="img-fluid mb-2"
                />
                <h5 className="fw-bold mb-0">Admin Login</h5>
                <small className="text-muted">
                  Sign in to access dashboard
                </small>
              </div>

              {/* Form */}
              <form onSubmit={AdminSubmitData}>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    name="email"
                    onChange={handler}
                    value={formData.email}
                    type="email"
                    className="form-control"
                    placeholder="Enter your admin email"
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    onChange={handler}
                    value={formData.password}
                    type="password"
                    className="form-control"
                    placeholder="Enter your admin password"
                  />
                </div>

                {/* Remember */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberAdmin"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="rememberAdmin"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link to={`/admin/forget-password`}
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>
            </div>

          </div>

          {/* Footer text */}
          <p className="text-center text-muted mt-3 mb-0">
            © {new Date().getFullYear()} Admin Panel
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
