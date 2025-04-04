const express = require('express');
const expenseController = require('../controller/expenseController');
const  expenseCategoryController = require("../controller/expense-categoryController");
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

// // Route to add a new expense
// router.post('/addExpense', verifyToken, expenseController.addExpense);

// router.get('/categories', verifyToken, expenseCategoryController.getAllCategories);

// router.get('/:id', verifyToken, expenseController.getExpenseById);

// router.put('/edit/:id', verifyToken, expenseController.editExpense);

// // Route to get total expenses
// router.get('/totalexpense', verifyToken, expenseController.getTotalExpense);

// router.get('/', verifyToken, expenseController.getAllExpenses);

// router.get('/staff/:staffId', verifyToken, expenseController.getExpensesByStaff);

// router.get('/total-expense/by-filter', verifyToken, expenseController.getTotalExpenseByFilter);

// // Route to get expenses by property name
// router.get('/expenses/by-property', verifyToken, expenseController.getExpensesByProperty);

// router.get('/monthlyExpense', verifyToken, expenseController.getMonthlyTotalExpense);

// router.post('/add', verifyToken, expenseCategoryController.addCategory);

router.post('/addExpense', verifyToken, expenseController.addExpense);

router.get('/categories', verifyToken, expenseCategoryController.getAllCategories);

router.post('/add', verifyToken, expenseCategoryController.addCategory);

router.get('/totalexpense', verifyToken, expenseController.getTotalExpense);

router.get('/total-expense/by-filter', verifyToken, expenseController.getTotalExpenseByFilter);

router.get('/expenses/by-property', verifyToken, expenseController.getExpensesByProperty);

router.get('/monthlyExpense', verifyToken, expenseController.getMonthlyTotalExpense);

router.get('/staff/:staffId', verifyToken, expenseController.getExpensesByStaff);

router.get('/salary-overview/:staffId', verifyToken, expenseController.getSalaryOverview);

router.get('/', verifyToken, expenseController.getAllExpenses);

router.get('/:id', verifyToken, expenseController.getExpenseById);

router.post('/pettycash', verifyToken, expenseController.addPettyCash)

router.get('/pettycash/get', verifyToken, expenseController.getPettyCash);

router.put('/edit/:id', verifyToken, expenseController.editExpense);

router.delete("/delete/:id", expenseController.deleteExpense);




module.exports = router;
