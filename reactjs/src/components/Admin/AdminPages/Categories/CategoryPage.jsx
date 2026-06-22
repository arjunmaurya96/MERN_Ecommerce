import React, { useState } from "react";
import AddCategory from "./AddCategory";

const CategoryPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Category Management</h4>

        {/* 🔥 MODAL OPEN BUTTON */}
        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          + Add Category
        </button>
      </div>

      {/* 🔥 MODAL RENDER (MOST IMPORTANT LINE) */}
      <AddCategory
        show={showModal}
        onClose={() => setShowModal(false)}
      />

    </div>
  );
};

export default CategoryPage;
