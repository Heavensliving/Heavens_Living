const express = require('express');
const expenseController = require('../controller/expenseController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

// Route to add a new expense
router.post('/addExpense', verifyToken, expenseController.addExpense);

// Route to get total expenses
router.get('/totalexpense', verifyToken, expenseController.getTotalExpense);

router.get('/', verifyToken, expenseController.getAllExpenses);

router.get('/staff/:staffId', verifyToken, expenseController.getExpensesByStaff);

// Route to get total expenses by property ID
router.get('/total-expense/by-filter', verifyToken, expenseController.getTotalExpenseByFilter);

// Route to get expenses by property name
router.get('/expenses/by-property', verifyToken, expenseController.getExpensesByProperty);

module.exports = router;
