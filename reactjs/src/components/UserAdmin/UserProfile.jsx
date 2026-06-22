import React, { useEffect, useState } from "react";
import axios from "axios";
// import { BASE_URL } from "../../services/BaseUrl";
import { BASE_URL } from "../../services/BaseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditUserProfile from "./UserDashboardPages/EditUserProfile";
import ChangePasswordUserProfile from "./UserDashboardPages/ChangePasswordUserProfile";

// import EditProfileModal from "./EditProfileModal";
// import ChangePasswordModal from "./ChangePasswordModal";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("userToken");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/user/profile/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2" />
        <p className="text-muted">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-danger">
        Unable to load profile
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">

      {/* ===== PROFILE HEADER ===== */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: 80, height: 80, fontSize: 32 }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="mb-0">{user.name}</h4>
            <p className="text-muted mb-1">{user.email}</p>
            <span className="badge bg-success">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      <div className="row g-4">

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-semibold">
              Personal Information
            </div>
            <div className="card-body">
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p>
                <b>Mobile:</b>{" "}
                {user.mobile || "Not Added"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-semibold">
              Account Information
            </div>
            <div className="card-body">
              <p><b>Role:</b> {user.role}</p>
              <p>
                <b>Status:</b>{" "}
                <span className="badge bg-success">
                  Active
                </span>
              </p>
              <p>
                <b>Joined:</b>{" "}
                {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ===== ACTIONS ===== */}
      <div className="card shadow-sm mt-4">
        <div className="card-body d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(true)}
          >
            Change Password
          </button>

          <button
            className="btn btn-outline-danger ms-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {showEdit && (
        <EditUserProfile
          user={user}
          onClose={() => setShowEdit(false)}
          onUpdate={fetchProfile}
        />
      )}

      {showPassword && (
        <ChangePasswordUserProfile
          onClose={() => setShowPassword(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
