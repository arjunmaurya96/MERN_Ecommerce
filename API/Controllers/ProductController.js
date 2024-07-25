const Products = require("../Models/ProductSchema")

//add product 
async function addProduct(req, res) {
    const { title, description, price, category, qty, imgsrc } = req.body;
    try {
        let product = await Products.create({
            title, description, price, category, qty, imgsrc
        })
        res.json({ message: "Product added successfully....!", product })

    } catch (error) {
        res.json(error.message)

    }
}


// get products 
async function getProducts(req, res) {
    let products = await Products.find().sort({ createdAt: -1 })
    res.json({ message: "All products", products })
}

// find product by id 
async function getProductById(req, res) {
    const id = req.params.id;
    let product = await Products.findById(id)
    if (!product) return res.json({ message: "Invalid Id" })
    res.json({ message: "Specific product", product });
}


// update product by id 
async function updateProductById(req, res) {
    const id = req.params.id;
    let product = await Products.findByIdAndUpdate(id, req.body, { new: true })
    if (!product) return res.json({ message: "Invalid Id" })
    res.json({ message: "Product had been updated", product });

}

// delete product by id 
async function deleteProductById(req, res) {
    const id = req.params.id;
    let product = await Products.findByIdAndDelete(id)
    if (!product) return res.json({ message: "Invalid Id" })
    res.json({ message: "Product had been deleted", product });
}




module.exports = {
    addProduct: addProduct,
    getProducts: getProducts,
    getProductById: getProductById,
    updateProductById: updateProductById,
    deleteProductById:deleteProductById
}