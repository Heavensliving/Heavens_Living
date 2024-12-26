const express = require('express');
const router = express.Router();
const { addStock, getStocks, updateStock, updateDailyUsage, deleteStock } = require('../controller/stockController');
const { verifyToken } = require('../middleware/tokenVerify');

router.get('/get', verifyToken, getStocks);
router.post('/add', verifyToken, addStock);
router.patch('/update', verifyToken, updateStock);
router.patch('/daily-usage', verifyToken, updateDailyUsage);
router.delete('/delete/:itemId', verifyToken, deleteStock);

module.exports = router;
