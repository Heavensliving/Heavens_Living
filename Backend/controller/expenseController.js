const Expense = require('../Models/expensePay');
const Property = require('../Models/Add_property'); // Assuming property model follows same format as in propertyController

// Add new expense
const addExpense = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Ensure the propertyId exists
    const property = await Property.findOne({ propertyId });
    if (!property) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const { transactionId } = req.body;

    // Check if transactionId already exists
    if (transactionId) {
      const existingExpense = await Expense.findOne({ transactionId });
      if (existingExpense) {
        return res.status(400).json({ error: 'Transaction ID already exists' });
      }
    }

    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ expense, id: expense._id });
  } catch (error) {
    res.status(400).json({ error: 'Error adding expense' });
  }
};

// Get total expense
const getTotalExpense = async (req, res) => {
  try {
    const totalExpense = await Expense.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    res.json({ totalAmount: totalExpense[0]?.totalAmount || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total expense amount' });
  }
};

// Get total expense by filter
const getTotalExpenseByFilter = async (req, res) => {
  try {
    const { propertyId } = req.query; // Get propertyId from query parameters

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const totalExpense = await Expense.aggregate([
      { $match: { propertyId } }, // Filter by propertyId
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    res.json({ totalAmount: totalExpense[0]?.totalAmount || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching total expense amount' });
  }
};

// Get expenses by property name
const getExpensesByProperty = async (req, res) => {
  try {
    const { propertyName } = req.query; // Get propertyName from query parameters

    if (!propertyName) {
      return res.status(400).json({ error: 'Property name is required' });
    }

    const expenses = await Expense.find({ propertyName });
    res.json({ expenses });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

// Exporting the functions using const
const expenseController = {
  addExpense,
  getTotalExpense,
  getTotalExpenseByFilter,
  getExpensesByProperty,
};

module.exports = expenseController;
