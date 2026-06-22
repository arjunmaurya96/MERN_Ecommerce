import React, { useState } from "react";
import axios from "axios";
// import { BASE_URL } from "../../services/BaseUrl";
import { BASE_URL } from "../../../services/BaseUrl";
import toast from "react-hot-toast";

const ChangePasswordUserProfile = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${BASE_URL}/api/user/profile/update-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password changed successfully");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Password change failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChangePasswordUserProfile;
