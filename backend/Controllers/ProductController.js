const productModel = require("../Models/ProductModel");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/Cloudinary")


const addProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      price,
      discountPrice,
      stock,
      isFeatured,
      status,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-");

    const existingProduct = await productModel.findOne({
      slug: finalSlug,
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        // local file delete
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      });

      images = await Promise.all(uploadPromises);
    }

    const product = await productModel.create({
      name,
      slug: finalSlug,
      description,
      category,
      price,
      discountPrice,
      images,
      stock,
      isFeatured:
        isFeatured === "true" || isFeatured === true,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("Add Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       slug,
//       description,
//       category,
//       price,
//       discountPrice,
//       stock,
//       isFeatured,
//       status,
//     } = req.body;

//     if (!name || !category || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, category and price are required",
//       });
//     }

//     const finalSlug =
//       slug ||
//       name
//         .toLowerCase()
//         .replace(/[^a-zA-Z0-9 ]/g, "")
//         .replace(/\s+/g, "-");

//     const existingProduct = await productModel.findOne({
//       slug: finalSlug,
//     });

//     if (existingProduct) {
//       return res.status(409).json({
//         success: false,
//         message: "Product already exists",
//       });
//     }

//     const images = req.files?.map(
//       (file) => `/uploads/${file.filename}`
//     );

//     const product = await productModel.create({
//       name,
//       slug: finalSlug,
//       description,
//       category,
//       price,
//       discountPrice,
//       images,
//       stock,
//       isFeatured,
//       status,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product,
//     });
//   } catch (error) {
//     console.log("Add Product Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===============================
// DELETE PRODUCT 
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    // Delete product from MongoDB
    await productModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// ===============================
// UPDATE / EDIT PRODUCT
// ===============================
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       slug,
//       description,
//       category,
//       price,
//       discountPrice,
//       stock,
//       isFeatured,
//       status,
//     } = req.body;

//     const product = await productModel.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // 🔹 Slug generate (agar nahi aaya)
//     const finalSlug =
//       slug ||
//       name
//         ?.toLowerCase()
//         .replace(/[^a-zA-Z0-9 ]/g, "")
//         .replace(/\s+/g, "-") ||
//       product.slug;

//     // 🔹 Check slug duplicate (excluding current product)
//     const slugExists = await productModel.findOne({
//       slug: finalSlug,
//       _id: { $ne: id },
//     });

//     if (slugExists) {
//       return res.status(409).json({
//         success: false,
//         message: "Product with this slug already exists",
//       });
//     }

//     // 🔹 If new images uploaded → delete old images
//     let images = product.images;

//     if (req.files && req.files.length > 0) {
//       // delete old images safely
//       if (product.images && product.images.length > 0) {
//         product.images.forEach((img) => {
//           const filePath = path.join(__dirname, "..", img);
//           if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//           }
//         });
//       }

//       // save new images
//       images = req.files.map(
//         (file) => `/uploads/${file.filename}`
//       );
//     }

//     // 🔹 Update product
//     const updatedProduct = await productModel.findByIdAndUpdate(
//       id,
//       {
//         name: name ?? product.name,
//         slug: finalSlug,
//         description: description ?? product.description,
//         category: category ?? product.category,
//         price: price ?? product.price,
//         discountPrice: discountPrice ?? product.discountPrice,
//         stock: stock ?? product.stock,
//         isFeatured: isFeatured ?? product.isFeatured,
//         status: status ?? product.status,
//         images,
//       },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.log("Update Product Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      category,
      price,
      discountPrice,
      stock,
      isFeatured,
      status,
    } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const finalSlug =
      slug ||
      name
        ?.toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-") ||
      product.slug;

    const slugExists = await productModel.findOne({
      slug: finalSlug,
      _id: { $ne: id },
    });

    if (slugExists) {
      return res.status(409).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    let images = product.images;

    // Agar new images upload hui hain
    if (req.files && req.files.length > 0) {
      // Old Cloudinary images delete karo
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(
              image.public_id
            );
          }
        }
      }

      // New images upload karo
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "products",
          }
        );

        // Local temp file delete
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      });

      images = await Promise.all(uploadPromises);
    }

    const updatedProduct =
      await productModel.findByIdAndUpdate(
        id,
        {
          name: name ?? product.name,
          slug: finalSlug,
          description:
            description ?? product.description,
          category: category ?? product.category,
          price: price ?? product.price,
          discountPrice:
            discountPrice ?? product.discountPrice,
          stock: stock ?? product.stock,
          isFeatured:
            isFeatured !== undefined
              ? isFeatured
              : product.isFeatured,
          status: status ?? product.status,
          images,
        },
        { new: true }
      );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Get New Arrivals Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productModel.find({
      isFeatured: true,
      status: "active",
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Get Featured Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getTopSellingProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: "active" })
      .sort({ stock: 1 }) // kam stock = zyada sale
      .limit(8);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log("Get Top Selling Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel.findOne({ slug })
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("Get Product By Slug Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    // current product
    const product = await productModel.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // related products
    const relatedProducts = await productModel.find({
      category: product.category,
      _id: { $ne: product._id }, // exclude current product
      status: "active",
    })
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      relatedProducts,
    });

  } catch (error) {
    console.log("Related Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getNewArrivals,
  getFeaturedProducts,
  getTopSellingProducts,
  getProductBySlug,
  getRelatedProducts
};
