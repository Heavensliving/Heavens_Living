const express = require('express');
const { addInventoryCategory, getInventoryCategories, deleteInventoryCategory } = require('../controller/InventoryCategoryController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

router.post('/add', verifyToken, addInventoryCategory);
router.get('/get', verifyToken, getInventoryCategories);
router.delete('/delete/:categoryId', deleteInventoryCategory);

module.exports = router;
