import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    parent: "",
    status: "active",
    description: "",
    type: "main",
  });

  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET CATEGORY DETAILS
  ========================= */
  const getCategory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/category/get-category-by-id/${id}`
      );
      console.log("my category data ", res)
      const cat = res.data.data;

      setFormData({
        name: cat.name,
        parent: cat.parent?._id || "",
        status: cat.status,
        description: cat.description || "",
        type: cat.parent ? "sub" : "main",
      });
    } catch (error) {
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GET MAIN CATEGORIES
  ========================= */
  const getMainCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/category/get-main-category"
      );
      setMainCategories(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load parent categories");
    }
  };

  useEffect(() => {
    getCategory();
    getMainCategories();
  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     UPDATE CATEGORY
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        type: formData.parent ? "sub" : "main",
      };

      const res = await axios.put(
        `http://localhost:8080/api/category/edit-category/${id}`,
        payload
      );

      if (res.data.success) {
        toast.success("Category updated successfully");
        setTimeout(() => {
          navigate("/admin/category-list"); n     

        }, 1500)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <>
      <h4 className="mb-4">Edit Category</h4>
      <Toaster />
      <div className="card shadow-sm">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="col-md-6">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PARENT */}
            <div className="col-md-6">
              <label className="form-label">Parent Category</label>
              <select
                className="form-select"
                name="parent"
                value={formData.parent}
                onChange={handleChange}
              >
                <option value="">None</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
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
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ACTIONS */}
            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Update Category
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/category-list")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
