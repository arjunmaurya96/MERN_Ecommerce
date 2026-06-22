import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    status: "active",
    description: "",
    images: [],
  });

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* =========================
     HANDLE IMAGE CHANGE
  ========================= */
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files),
    });
  };

  /* =========================
     GET CATEGORIES
  ========================= */
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://mern-ecommerce-zt4z.onrender.com/api/category/get-all-category"
      );
      setCategories(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  /* =========================
     SUBMIT PRODUCT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Name, Price and Category are required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 FormData (IMPORTANT)
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("status", formData.status);
      data.append("description", formData.description);

      // 🔹 Append images
      formData.images.forEach((img) => {
        data.append("images", img);
      });

      const res = await axios.post(
        "https://mern-ecommerce-zt4z.onrender.com/api/product/add-product",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Product added successfully");

        setFormData({
          name: "",
          price: "",
          discountPrice: "",
          category: "",
          stock: "",
          status: "active",
          description: "",
          images: [],
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="mb-4">Add Product</h4>
      <Toaster />

      <div className="card shadow-sm">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Price */}
            <div className="col-md-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            {/* Discount */}
            <div className="col-md-3">
              <label className="form-label">Discount Price</label>
              <input
                type="number"
                className="form-control"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="col-md-3">
              <label className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="col-md-3">
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

            {/* Images */}
            <div className="col-md-6">
              <label className="form-label">Product Images</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleImageChange}
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="col-12 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Product"}
              </button>

              <button
                type="reset"
                className="btn btn-secondary"
                onClick={() =>
                  setFormData({
                    name: "",
                    price: "",
                    discountPrice: "",
                    category: "",
                    stock: "",
                    status: "active",
                    description: "",
                    images: [],
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
