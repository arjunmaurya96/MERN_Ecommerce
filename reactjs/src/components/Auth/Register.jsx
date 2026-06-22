import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const handler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }
  const SubmitData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user-register",
        formData
      );
      toast.success(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: ""
      })
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };


  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <Toaster />
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">

          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">

              <h3 className="text-center fw-bold mb-2">Create Account</h3>
              <p className="text-center text-muted mb-4">
                Register to get started
              </p>

              <form onSubmit={SubmitData}>
                {/* Full Name */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handler}
                    className="form-control"
                    id="name"
                    placeholder="Full Name"
                    required
                  />
                  <label htmlFor="name">Full Name</label>
                </div>

                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handler}
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="email">Email address</label>
                </div>

                {/* Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    name="password"
                    onChange={handler}
                    value={formData.password}
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>

                {/* Confirm Password */}
                {/* <div className="form-floating mb-4">
                  <input
                    type="password"
                    name="password"
                    onChange={handler}
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    required
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div> */}

                {/* Register Button */}
                <button type="submit" className="btn btn-primary w-100 py-2">
                  Register
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Already have an account?{" "}
                <Link to={`/login`} className="fw-semibold text-decoration-none">
                  Login
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
