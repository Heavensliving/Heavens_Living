const Expense = require('../Models/expensePay');
const Property = require('../Models/Add_property');
const Staff = require('../Models/Add_staff');

// Add new expense
const addExpense = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      otherReason,
      paymentMethod,
      amount,
      date,
      propertyId,
      propertyName,
      staff,
      transactionId,
      billImg
    } = req.body;
    // Validate required fields
    if (!title || !type || !category || !amount || !date || !propertyId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate propertyId exists in Property collection
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(400).json({ error: "Invalid property ID." });
    }

    // Check for duplicate transactionId
    const existingExpense = await Expense.findOne({ transactionId });
    if (existingExpense) {
      return res.status(400).json({ error: "Transaction ID already exists." });
    }

    // Ensure staff is required for "Salary" type
    if (category.toLowerCase() === "salary" && !staff) {
      return res.status(400).json({ error: "Staff ID is required for salary payments." });
    }

    // Create new expense
    const newExpense = new Expense({
      title,
      type,
      category,
      otherReason: otherReason || undefined, // Optional field
      paymentMethod,
      amount,
      date,
      propertyId,
      propertyName,
      staff: staff || undefined, // Optional field
      transactionId,
      billImg: billImg || undefined,
    });
    console.log(newExpense)
    await newExpense.save();
    console.log(newExpense)

    res.status(201).json({ message: "Expense added successfully.", expense: newExpense });
  } catch (error) {
    console.error("Error adding expense:", error.message || error);
    res.status(500).json({ error: "Internal server error." });
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

const getExpenseById = async (req, res, next) => {
  const expenseId = req.params.id;
  let result;
  try {
    result = await Expense.findById(expenseId);
    if (!result)
      return res.status(404).json({ message: 'expense not exist.' });

  } catch (err) {
    return res.status(500).json({ message: "Error occured in fetching the expense" })
  }
  return res.status(200).json({ result });
}

const editExpense = async (req, res) => {
  try {
    const { staff } = req.body;
    const updatedData = req.body;
    const expenseData = await Expense.findById(req.params.id);

    if (!expenseData) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    if (staff && staff !== expenseData.staff.toString()) {
      await Expense.findOneAndUpdate(
        { propertyId: expenseData.propertyId },
        { $pull: { staff: expenseData.staff } }
      );
    }

    // Update the expense data
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
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
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find(); // Retrieve all expenses
    res.json({ expenses });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};
const getExpensesByStaff = async (req, res) => {
  try {
    const { staffId } = req.params; // Extract staff ID from URL parameters

    if (!staffId) {
      return res.status(400).json({ error: "Staff ID is required" });
    }

    // Query the database for expenses associated with the given staff ID
    const expenses = await Expense.find({ staff: staffId });

    if (expenses.length === 0) {
      return res.status(404).json({ error: "No expenses found for the provided staff ID" });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses by staff ID:", error);
    res.status(500).json({ error: "Error fetching expenses by staff ID" });
  }
};
const getMonthlyTotalExpense = async (req, res) => {
  try {
    const monthlyExpense = await Expense.aggregate([
      {
        $project: {
          month: { $month: "$date" }, // Extract the month
          year: { $year: "$date" },  // Extract the year
          amount: 1,                      // Include the amount field
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" }, // Group by year and month
          totalAmount: { $sum: "$amount" },       // Sum up the amounts
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ]);

    const formattedResponse = monthlyExpense.map((item) => ({
      month: item._id.month,
      year: item._id.year,
      totalExpense: item.totalAmount, // Return only total expense
    }));
    res.json(formattedResponse); // Return formatted data
  } catch (error) {
    console.error("Error fetching monthly total expense:", error);
    res.status(500).json({ error: "Error fetching monthly total expense" });
  }
};


// Exporting the functions using const
const expenseController = {
  addExpense,
  getTotalExpense,
  getTotalExpenseByFilter,
  getExpensesByProperty,
  getAllExpenses,
  getExpensesByStaff,
  getMonthlyTotalExpense,
  getExpenseById,
  editExpense,
};

module.exports = expenseController;
