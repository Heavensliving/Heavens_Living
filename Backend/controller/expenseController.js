const Expense = require('../Models/expensePay');
const Property = require('../Models/Add_property');
const Staff = require('../Models/Add_staff');
const PettycashSchema = require('../Models/Pettycash');

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
      salaryMonth,
      leaveTaken,
      handledBy,
      pettyCashType,
      date,
      propertyId,
      propertyName,
      staff,
      transactionId,
      billImg,
    } = req.body;

    // ✅ Generate Transaction ID dynamically
    let transactionID = transactionId;
    if (paymentMethod === "Cash") {
      transactionID = `CASH_${Date.now()}`;
    } else if (paymentMethod === "Petty Cash") {
      if (!pettyCashType) {
        return res.status(400).json({ error: "pettyCashType is required when using Petty Cash." });
      }
      transactionID = pettyCashType === "Cash" ? `PETTYCASH_${Date.now()}` : transactionId;
      if (pettyCashType === "UPI" && !transactionId) {
        return res.status(400).json({ error: "Transaction ID is required for UPI petty cash." });
      }
    }

    // ✅ Validate required fields in one step
    if (!title || !type || !category || !amount || !date || !propertyId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ error: "Invalid amount value." });
    }

    // ✅ Run database queries in parallel to reduce execution time
    const [property, existingExpense, pettyCashHandler] = await Promise.all([
      Property.findById(propertyId),
      Expense.findOne({ transactionId: transactionID }),
      paymentMethod.toLowerCase() === "petty cash" ? PettycashSchema.findOne({ staff: handledBy }) : null,
    ]);

    if (!property) return res.status(400).json({ error: "Invalid property ID." });
    if (existingExpense) return res.status(400).json({ error: "Transaction ID already exists." });
    if (category.toLowerCase() === "salary" && !staff) {
      return res.status(400).json({ error: "Staff ID is required for salary payments." });
    }

    // ✅ Deduct from petty cash (if applicable)
    if (paymentMethod.toLowerCase() === "petty cash") {
      if (!handledBy) return res.status(400).json({ error: "HandledBy is required for petty cash payments." });
      if (!pettyCashHandler) {
        return res.status(400).json({ error: `No petty cash record found for ${handledBy}.` });
      }
      if (pettyCashHandler.amount < amountNumber) {
        return res.status(400).json({ error: `${handledBy} does not have sufficient funds in petty cash.` });
      }
      pettyCashHandler.amount -= amountNumber;
      await pettyCashHandler.save(); // Update petty cash
    }

    // ✅ Create and save the new expense
    const newExpense = new Expense({
      title,
      type,
      category,
      otherReason: otherReason || undefined,
      paymentMethod,
      amount,
      salaryMonth,
      leaveTaken,
      handledBy,
      pettyCashType: pettyCashType || undefined,
      date,
      propertyId,
      propertyName,
      staff: staff || undefined,
      transactionId,
      billImg: billImg || undefined,
    });

    await newExpense.save();

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
    const { paymentMethod, handledBy, amount } = req.body;
    const updatedData = { ...req.body };

    const expenseData = await Expense.findById(req.params.id);
    if (!expenseData) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const prevAmount = parseFloat(expenseData.amount);
    const newAmount = parseFloat(amount);

    if (isNaN(newAmount)) {
      return res.status(400).json({ error: "Invalid amount value." });
    }

    // 🔹 **CASE 1: If previous payment was Petty Cash, refund the old handler**
    if (expenseData.paymentMethod.toLowerCase() === "petty cash") {
      const prevHandler = await PettycashSchema.findOne({ staff: expenseData.handledBy });
      if (prevHandler) {
        prevHandler.amount += prevAmount; // Refund previous amount
        await prevHandler.save();
      }
    }

    // 🔹 **CASE 2: If new payment method is Petty Cash, deduct from new handler**
    if (paymentMethod.toLowerCase() === "petty cash") {
      const newHandler = await PettycashSchema.findOne({ staff: handledBy });

      if (!newHandler) {
        return res.status(400).json({ error: `No petty cash record found for ${handledBy}.` });
      }

      if (newHandler.amount < newAmount) {
        return res.status(400).json({
          error: `${handledBy} does not have sufficient funds in petty cash. Available: ₹${newHandler.amount}.`,
        });
      }

      newHandler.amount -= newAmount; // Deduct new amount
      await newHandler.save();
    }

    // 🔹 **CASE 3: If payment method is changed to Cash or Petty Cash (via Cash), remove transaction ID**
    if (paymentMethod.toLowerCase() === "cash" || (paymentMethod.toLowerCase() === "petty cash" && req.body.pettyCashType === "Cash")) {
      updatedData.transactionId = undefined; // Remove transaction ID
    }

    // Update the expense in the database
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.status(200).json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    console.error("Error updating expense:", error.message || error);
    res.status(500).json({ message: "Error updating expense", error });
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

    const staffData = await Staff.findById(staffId);

    const expenses = await Expense.find({ staff: staffId });

    if (expenses.length === 0) {
      return res.status(404).json({ error: "No expenses found for the provided staff ID" });
    }

    res.status(200).json({
      salary: staffData.Salary,
      salaryMonths: staffData.salaryMonths || [],
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses by staff ID:", error);
    res.status(500).json({ error: "Error fetching expenses by staff ID" });
  }
};

const getSalaryOverview = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({ error: "Staff ID is required" });
    }

    // Fetch staff details to get the monthly salary
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const monthlySalary = staff.Salary || 0;

    // Fetch salary transactions for the staff
    const salaryTransactions = await Expense.find({
      staff: staffId,
      category: "Salary"
    });

    if (salaryTransactions.length === 0) {
      return res.status(404).json({ error: "No salary transactions found" });
    }

    // Calculate total salary paid
    const totalSalaryPaid = salaryTransactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

    // Get the latest salary transaction for leave taken
    const latestTransaction = salaryTransactions[salaryTransactions.length - 1];
    console.log("here", latestTransaction)
    const leaveTaken = latestTransaction?.leaveTaken || 0;

    // Calculate leave deduction (assuming salaryMonth is 30 days)
    const perDaySalary = monthlySalary / 30;
    const leaveDeduction = leaveTaken * perDaySalary;

    // Calculate net salary due after deductions
    const netSalaryDue = Math.max(monthlySalary - leaveDeduction, 0);

    // Determine pending or advance salary
    let pendingSalary = Math.max(netSalaryDue - totalSalaryPaid, 0);
    let advanceSalary = Math.max(totalSalaryPaid - netSalaryDue, 0);

    res.status(200).json({
      staffId,
      monthlySalary,
      totalSalaryPaid,
      leaveTaken,
      leaveDeduction,
      netSalaryDue,
      pendingSalary,
      advanceSalary,
      transactions: salaryTransactions.reverse() // Returning the transactions as well
    });

  } catch (error) {
    console.error("Error fetching salary overview:", error);
    res.status(500).json({ error: "Error fetching salary overview" });
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

// Add pettycash
const addPettyCash = async (req, res) => {
  try {
    const { amount, staff } = req.body;

    const existingPettyCash = await PettycashSchema.findOne({ staff });

    if (existingPettyCash) {
      existingPettyCash.amount += amount; // Add the new amount to the existing one
      await existingPettyCash.save();
      // console.log('Updated Petty Cash:', existingPettyCash);
      return res.status(200).json(existingPettyCash);
    } else {
      // Create a new record if none exists
      const newPettyCash = new PettycashSchema({
        amount,
        staff,
      });
      await newPettyCash.save();
      console.log('New Petty Cash Created:', newPettyCash);
      return res.status(201).json(newPettyCash);
    }
  } catch (error) {
    console.error('Error adding/updating Petty Cash:', error);
    res.status(500).json({ message: 'Failed to add/update Petty Cash', error });
  }
};

const getPettyCash = async (req, res) => {
  try {
    const PettyCash = await PettycashSchema.find();
    res.status(200).json(PettyCash);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense by ID
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    // If the expense was made using Petty Cash, refund the amount
    if (expense.paymentMethod.toLowerCase() === "petty cash") {
      if (expense.handledBy) {
        const pettyCashHandler = await PettycashSchema.findOne({ staff: expense.handledBy });

        if (pettyCashHandler) {
          pettyCashHandler.amount += parseFloat(expense.amount);
          await pettyCashHandler.save();
        }
      }
    }

    // Delete the expense from the database
    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error("Error deleting expense:", error.message || error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const addStaffPayment = async (req, res) => {
  try {
    const {
      name,
      staffId, // Employee ID to check in both collections
      totalAmount,
      amount,
      paymentMode,
      transactionId,
      propertyId,
      property,
      paidDate,
      leaveTaken,
      remarks,
      billImg
    } = req.body;

    console.log("Received Request Body:", req.body); // Debugging log

    // Validate if transactionId is required
    if ((paymentMode === 'UPI' || paymentMode === 'Bank Transfer') && !transactionId) {
      return res.status(400).json({ message: "Transaction ID is required for UPI or Bank Transfer payments." });
    }

    let staff = await Staff.findById(staffId); // Check in Staff collection

    let differInSalary = 0;

    if (leaveTaken !== 0) {
      let total = totalAmount - staff.pendingSalary;
      differInSalary = Math.abs(total);
    }

    const previousPendingSalary = staff.pendingSalary || 0;
    let dueAmount = previousPendingSalary - amount - differInSalary;
    console.log(dueAmount)
    console.log(previousPendingSalary, amount, differInSalary)
    let newBalance = staff.advanceSalary || 0;

    // If overpaid, store extra amount in advanceSalary
    if (dueAmount < 0) {
      newBalance += Math.abs(dueAmount);
      dueAmount = 0;
    }

    // Calculate the months for which rent is due
    const currentDate = new Date();
    const joinDate = staff.joinDate;
    const salary = staff.Salary;

    let salaryMonths = [];
    let tempDate = new Date(joinDate);
    while (tempDate <= currentDate) {
      const monthYear = tempDate.toLocaleString('default', { month: 'long' }) + ' ' + tempDate.getFullYear();
      salaryMonths.push(monthYear);
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Ensure salaryMonths are in order and add missing ones
    staff.salaryMonths = staff.salaryMonths || [];
    for (let monthYear of salaryMonths) {
      if (!staff.salaryMonths.some(rm => rm.monthYear === monthYear)) {
        staff.salaryMonths.push({
          monthYear,
          paidAmount: 0,
          salaryCut: 0,
          status: "Pending"
        });
      }
    }

    // Sort salaryMonths in ascending order (oldest first)
    staff.salaryMonths.sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));

    let remainingAmount = amount;
    let remainingdifferInSalary = differInSalary;
    // Ensure fullyClearedSalaryMonths contains only unique months
    let fullyClearedSalaryMonthsSet = new Set();

    // Allocate wave-off amount first
    for (let month of staff.salaryMonths) {
      if (remainingdifferInSalary <= 0) break;

      let rentDue = salary - (month.paidAmount + month.salaryCut);
      let waveOffApplied = Math.min(remainingdifferInSalary, rentDue);

      month.salaryCut += waveOffApplied;
      remainingdifferInSalary -= waveOffApplied;

      if (month.paidAmount + month.salaryCut >= salary) {
        month.status = "Paid";
        fullyClearedSalaryMonthsSet.add(month.monthYear); // ✅ Prevent duplicate entries
      }
    }

    // Allocate payment amount next
    for (let month of staff.salaryMonths) {
      if (remainingAmount <= 0) break;

      let rentDue = salary - (month.paidAmount + month.salaryCut);
      let paymentApplied = Math.min(remainingAmount, rentDue);

      month.paidAmount += paymentApplied;
      remainingAmount -= paymentApplied;

      if (month.paidAmount + month.salaryCut >= salary) {
        month.status = "Paid";
        fullyClearedSalaryMonthsSet.add(month.monthYear); // ✅ Prevent duplicate entries
      }
    }

    // Convert Set back to an array before saving
    let fullyClearedSalaryMonths = [...fullyClearedSalaryMonthsSet];

    // If still remaining amount, apply to future months
    while (remainingAmount > 0 || remainingdifferInSalary > 0) {
      let nextMonth = new Date(staff.salaryMonths[staff.salaryMonths.length - 1].monthYear);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      let monthYear = nextMonth.toLocaleString('default', { month: 'long' }) + ' ' + nextMonth.getFullYear();

      let newMonth = {
        monthYear,
        paidAmount: 0,
        salaryCut: 0,
        status: "Pending"
      };

      let rentDue = salary;

      if (remainingdifferInSalary > 0) {
        let waveOffApplied = Math.min(remainingdifferInSalary, rentDue);
        newMonth.salaryCut = waveOffApplied;
        remainingdifferInSalary -= waveOffApplied;
        rentDue -= waveOffApplied;
      }

      if (remainingAmount > 0) {
        console.log("Before applying payment - remainingAmount:", remainingAmount, "rentDue:", rentDue);

        let paymentApplied = Math.min(remainingAmount, rentDue);
        newMonth.paidAmount = paymentApplied;
        remainingAmount -= paymentApplied;
        rentDue -= paymentApplied;
      }

      if (newMonth.paidAmount + newMonth.salaryCut >= salary) {
        newMonth.status = "Paid";
        fullyClearedSalaryMonths.push(monthYear);
      }

      staff.salaryMonths.push(newMonth);
    }

    // Create a new payment record
    const newPayment = new Expense({
      title: `${name} - Salary`,
      type: 'PG',
      category: 'Salary',
      propertyId: propertyId,
      propertyName: property,
      leaveTaken,
      amount,
      pendingSalary: dueAmount,
      advanceSalary: newBalance,
      paymentMethod: paymentMode,
      transactionId: (paymentMode === 'UPI' || paymentMode === 'Bank Transfer') ? transactionId : null,
      salaryStatus: dueAmount === 0 ? "Paid" : "Pending",
      fullyClearedSalaryMonths,
      date: paidDate,
      otherReason: remarks || "",
      billImg: billImg || undefined,
      staff: staff._id,
    });

    // Save payment
    await newPayment.save();
    console.log("Payment Saved:", newPayment);

    // Update staff record   
    staff.salaryStatus = newPayment.salaryStatus;
    staff.pendingSalary = dueAmount;
    staff.advanceSalary = newBalance;
    staff.salaryPayments.push(newPayment._id);
    await staff.save();
    console.log("Employee Updated:", staff);

    return res.status(201).json({
      message: "Employee payment processed successfully",
      payment: newPayment
    });

  } catch (error) {
    console.error("Error Processing Payment:", error.message);
    return res.status(500).json({ message: error.message });
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
  addPettyCash,
  getPettyCash,
  getSalaryOverview,
  deleteExpense,
  addStaffPayment,
};

module.exports = expenseController;
