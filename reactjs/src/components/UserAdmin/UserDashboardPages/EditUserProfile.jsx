import React, { useState } from "react";
import axios from "axios";
// import { BASE_URL } from "../../services/BaseUrl";
import { BASE_URL } from "../../../services/BaseUrl";
import toast from "react-hot-toast";

const EditUserProfile = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${BASE_URL}/api/user/profile/update-profile`,
        { name, mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");

      onUpdate(); // refresh parent profile
      onClose();  // close modal
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
