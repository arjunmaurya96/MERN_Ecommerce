import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    parent: "",
    status: "active",
    description: "",
  });

  const [parentCategories, setParentCategories] = useState([]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* =========================
     GET MAIN CATEGORIES
     (Parent Categories)
  ========================= */
  const getParentCategories = async () => {
    try {
      const res = await axios.get(
        "https://mern-ecommerce-zt4z.onrender.com/api/category/get-main-category"
      );

      setParentCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to load parent categories");
    }
  };

  useEffect(() => {
    getParentCategories();
  }, []);

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }

    // 🔥 AUTO SET TYPE
    const payload = {
      ...formData,
      type: formData.parent ? "sub" : "main",
    };

    try {
      const res = await axios.post(
        "https://mern-ecommerce-zt4z.onrender.com/api/category/add-category",
        payload
      );

      toast.success(res.data.message || "Category added successfully");

      // reset
      setFormData({
        name: "",
        parent: "",
        status: "active",
        description: "",
      });

      // refresh parent list
      getParentCategories();

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  /* =========================
     RESET FORM
  ========================= */
  const handleReset = () => {
    setFormData({
      name: "",
      parent: "",
      status: "active",
      description: "",
    });
  };

  return (
    <div className="container-fluid mt-4">
      <Toaster/>

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Add Category</h4>
      </div>

      {/* CARD */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">

          <form className="row g-4" onSubmit={handleSubmit}>

            {/* CATEGORY NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics"
              />
            </div>

            {/* PARENT CATEGORY */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Parent Category
              </label>
              <select
                className="form-select"
                name="parent"
                value={formData.parent}
                onChange={handleChange}
              >
                <option value="">None (Main Category)</option>

                {parentCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {formData.parent && (
                <small className="text-success">
                  This will be added as a sub-category
                </small>
              )}
            </div>

            {/* STATUS */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Status
              </label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write short description about category (optional)"
              ></textarea>
            </div>

            {/* ACTION BUTTONS */}
            <div className="col-12 d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Save Category
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddCategory;
