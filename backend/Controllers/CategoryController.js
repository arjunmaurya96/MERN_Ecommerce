// const Category = require("../models/Category");
const Category = require('../Models/CategoryModel')

// simple slug 
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// ===============================
// ADD CATEGORY CONTROLLER
// ===============================
const addCategory = async (req, res) => {
  try {
    const {
      name,
      type = "main",
      parent = null,
      status = "active",
      description,
    } = req.body;

    // 1️⃣ Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // 2️⃣ Generate slug
    const slug = generateSlug(name);

    // 3️⃣ Check duplicate slug
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // 4️⃣ Create category
    const category = await Category.create({
      name,
      slug,
      type,
      parent: type === "sub" ? parent : null,
      status,
      description,
      createdBy: req.admin?._id || null, // optional (admin auth later)
    });

    // 5️⃣ Response
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: category,
    });

  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding category",
    });
  }
};

const getMainCategories = async (req, res) => {
  const categories = await Category.find({ parent: null, status: "active" })
    .select("_id name")
    .sort({ name: 1 });

  res.json({
    success: true,
    data: categories,
  });
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// -----------delete category----------------
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // 1️⃣ Check id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // 2️⃣ Check category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3️⃣ Check sub categories
    const hasSubCategories = await Category.findOne({ parent: id });
    if (hasSubCategories) {
      return res.status(400).json({
        success: false,
        message: "Please delete sub-categories first",
      });
    }

    // 4️⃣ Delete category
    await Category.findByIdAndDelete(id);

    // 5️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error("Delete Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      parent,
      status,
      description,
    } = req.body;

    // 1️⃣ Check ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // 2️⃣ Check category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3️⃣ If name updated → generate new slug
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = generateSlug(name);

      // duplicate slug check (ignore current category)
      const existing = await Category.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // 4️⃣ Update category
    category.name = name ?? category.name;
    category.slug = slug;
    category.type = type ?? category.type;
    category.status = status ?? category.status;
    category.description = description ?? category.description;
    category.parent =
      type === "sub"
        ? parent ?? category.parent
        : null;

    await category.save();

    // 5️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });

  } catch (error) {
    console.error("Edit Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // 2️⃣ Find category
    const category = await Category.findById(id)
      .populate("parent", "name"); // parent ka name + id

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3️⃣ Success response
    return res.status(200).json({
      success: true,
      data: category,
    });

  } catch (error) {
    console.error("Get Category By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  addCategory,
  getMainCategories,
  getAllCategories,
  deleteCategory,
  editCategory,
  getCategoryById
};
