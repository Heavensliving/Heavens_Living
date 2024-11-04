const express = require('express');
const expenseController = require('../controller/expenseController');

const router = express.Router();

// Route to add a new expense
router.post('/addExpense', expenseController.addExpense);

// Route to get total expenses
router.get('/totalexpense', expenseController.getTotalExpense);

router.get('/', expenseController.getAllExpenses);

// Route to get total expenses by property ID
router.get('/total-expense/by-filter', expenseController.getTotalExpenseByFilter);

// Route to get expenses by property name
router.get('/expenses/by-property', expenseController.getExpensesByProperty);

module.exports = router;
