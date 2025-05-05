const express = require('express');
const router = express.Router();
const { 
  addStock, 
  getStocks, 
  updateStock, 
  updateDailyUsage, 
  deleteStock, 
  getUsageLogs,
  editStock 
} = require('../controller/stockController');
const { verifyToken } = require('../middleware/tokenVerify');
const UsageLog = require('../Models/UsageLog');

router.get('/get', verifyToken, getStocks);
router.post('/add', verifyToken, addStock);
router.patch('/update', verifyToken, updateStock);
router.patch('/daily-usage', verifyToken, updateDailyUsage);
router.delete('/delete/:itemId', verifyToken, deleteStock);
router.get('/usage-log', verifyToken, getUsageLogs);
router.patch('/edit/:itemId', verifyToken, editStock);

module.exports = router;
