const express = require('express');
const  CategoryController = require("../controller/CategoryController");

const router = express.Router();


router.post('/add', CategoryController.addCategory);

router.get('/', CategoryController.getAllCategories);

router.get('/:categoryId', CategoryController.getItemsByCategory);

router.get('/:id', CategoryController.getCategoryById);

router.put('/update/:id', CategoryController.updateCategory);

router.delete('/delete/:id', CategoryController.deleteCategory);

module.exports = router;
