const express = require('express');
const router = express.Router();
const { addStock, getStocks, updateStock } = require('../controller/stockController');  // Correctly import updateStock
const { verifyToken } = require('../middleware/tokenVerify');

router.get('/get', verifyToken, getStocks);
router.post('/add', verifyToken, addStock);

module.exports = router;
