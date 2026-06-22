import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET ALL CATEGORIES
  ========================= */
  const getCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/category/get-all-category"
      );
      

      setCategories(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  /* =========================
   DELETE CATEGORY
========================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/api/category/delete-category/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message || "Category deleted");
        getCategories(); // 🔄 refresh list
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  };



  return (
    <div className="container-fluid">
      <Toaster/>

      {/* PAGE HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h4 className="mb-0">Category Management</h4>
          <small className="text-muted">
            Manage all product categories here
          </small>
        </div>

        <Link to="/admin/add-category" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      {/* CARD */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Category Name</th>
                  <th>Parent Category</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {/* LOADING */}
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                    </td>
                  </tr>
                )}

                {/* DATA */}
                {!loading && categories.length > 0 &&
                  categories.map((cat, index) => (
                    <tr key={cat._id}>
                      <td className="fw-semibold">{index + 1}</td>

                      <td>
                        <div className="fw-semibold">{cat.name}</div>
                        {cat.parent && (
                          <small className="text-muted">
                            Sub Category
                          </small>
                        )}
                      </td>

                      <td>
                        {cat.parent ? (
                          <span className="badge bg-light text-dark">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                      <td>
                        {cat.status === "active" ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/admin/edit-category/${cat._id}`}
                          className="btn btn-sm btn-outline-warning me-2"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}
                {/* EMPTY STATE */}
                {!loading && categories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryList;
