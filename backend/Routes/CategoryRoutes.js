const { addCategory, getMainCategories, getAllCategories, deleteCategory, editCategory, getCategoryById } = require('../Controllers/CategoryController');

const router = require('express').Router();

router.post('/add-category', addCategory)
router.get("/get-main-category", getMainCategories)
router.get("/get-all-category", getAllCategories)
router.delete('/delete-category/:id', deleteCategory)
router.put("/edit-category/:id", editCategory)
router.get("/get-category-by-id/:id", getCategoryById)

module.exports = router;