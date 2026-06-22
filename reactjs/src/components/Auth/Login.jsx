import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from '../../context/AuthContext'
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ CONTEXT LOGIN

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitLoginData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mern-ecommerce-zt4z.onrender.com/api/user-login",
        formData
      );

      // 🔥 FIX STARTS HERE
      login(response.data.token); // ✅ context + localStorage handled
      toast.success(response.data.message);
      // 🔥 FIX ENDS HERE

      setFormData({ email: "", password: "" });

      navigate("/"); // redirect home
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <Toaster />

          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4 p-sm-5">

              {/* Heading */}
              <h3 className="text-center fw-bold mb-1">
                Welcome Back
              </h3>
              <p className="text-center text-muted mb-4">
                Login to your account
              </p>

              {/*  GOOGLE LOGIN BUTTON */}

              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const token = credentialResponse.credential;

                  try {
                    const res = await axios.post(
                      "https://mern-ecommerce-zt4z.onrender.com/api/auth/google",
                      { token }
                    );

                    console.log(res.data);

                    // ✅ login context
                    login(res.data.token);

                    toast.success("Google Login Success");
                    navigate("/");

                  } catch (err) {
                    console.log(err);
                    toast.error("Google login failed");
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
              {/* <button
                type="button"
                className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  width="20"
                />
                <span>Continue with Google</span>
              </button> */}

              {/* OR Divider */}
              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted small">OR</span>
                <hr className="flex-grow-1" />
              </div>

              {/* 🔐 EMAIL / PASSWORD LOGIN */}
              <form onSubmit={submitLoginData}>
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
                    value={formData.password}
                    onChange={handler}
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>

                {/* Remember + Forgot */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>

                  <Link
                    to={`/forget-password`}
                    className="text-decoration-none small"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                >
                  Login
                </button>
              </form>

              {/* Register */}
              <p className="text-center mt-4 mb-0">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="fw-semibold text-decoration-none"
                >
                  Register
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;









// import axios from "axios";
// import React, { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   })

//   const handler = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value })
//   }

//   const submitLoginData = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("https://mern-ecommerce-zt4z.onrender.com/api/user-login", formData)
//       const token = response.data.token;
//       localStorage.setItem("token", token)
//       toast.success(response.data.message)
//       setFormData({
//         email: "",
//         password: ""
//       })
//         navigate('/')
//     } catch (error) {
//       console.log(error)
//       if (error.response && error.response.data.message) {
//         toast.error(error.response.data.message)
//       }
//     }
//   }


//   return (
//     <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
//       <div className="row w-100 justify-content-center">
//         <div className="col-12 col-sm-10 col-md-6 col-lg-4">
//           <Toaster />
//           <div className="card shadow border-0 rounded-4">
//             <div className="card-body p-4 p-sm-5">

//               <h3 className="text-center fw-bold mb-2">Welcome Back</h3>
//               <p className="text-center text-muted mb-4">
//                 Login to your account
//               </p>

//               <form onSubmit={submitLoginData}>
//                 {/* Email */}
//                 <div className="form-floating mb-3">
//                   <input
//                     type="email"
//                     name="email"
//                     onChange={handler}
//                     value={formData.email}
//                     className="form-control"
//                     id="email"
//                     placeholder="name@example.com"
//                     required
//                   />
//                   <label htmlFor="email">Email address</label>
//                 </div>

//                 {/* Password */}
//                 <div className="form-floating mb-3">
//                   <input
//                     type="password"
//                     name="password"
//                     onChange={handler}
//                     value={formData.password}
//                     className="form-control"
//                     id="password"
//                     placeholder="Password"
//                     required
//                   />
//                   <label htmlFor="password">Password</label>
//                 </div>

//                 {/* Remember + Forgot */}
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                   <div className="form-check">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="remember"
//                     />
//                     <label className="form-check-label" htmlFor="remember">
//                       Remember me
//                     </label>
//                   </div>

//                   <a href="#" className="text-decoration-none">
//                     Forgot password?
//                   </a>
//                 </div>

//                 {/* Button */}
//                 <button type="submit" className="btn btn-primary w-100 py-2">
//                   Login
//                 </button>
//               </form>

//               <p className="text-center mt-4 mb-0">
//                 Don’t have an account?{" "}
//                 <Link to={`/register`} className="fw-semibold text-decoration-none">
//                   Register
//                 </Link>
//               </p>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
