const express = require('express');
const expenseController = require('../components/expenseController');

const router = express.Router();

// Route to add a new expense
router.post('/add-expense', expenseController.addExpense);

// Route to get total expenses
router.get('/total-expense', expenseController.getTotalExpense);

// Route to get total expenses by property ID
router.get('/total-expense/by-filter', expenseController.getTotalExpenseByFilter);

// Route to get expenses by property name
router.get('/expenses/by-property', expenseController.getExpensesByProperty);

module.exports = router;
