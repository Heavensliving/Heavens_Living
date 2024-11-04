const express = require('express');
const  CategoryController = require("../controller/CategoryController");
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();


router.post('/add', verifyToken, CategoryController.addCategory);

router.get('/', verifyToken, CategoryController.getAllCategories);

router.get('/:categoryId', verifyToken, CategoryController.getItemsByCategory);

router.get('/:id', verifyToken, CategoryController.getCategoryById);

router.put('/update/:id', verifyToken, CategoryController.updateCategory);

router.delete('/delete/:id', verifyToken, CategoryController.deleteCategory);

module.exports = router;
