const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  otherReason: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true
  },
  salaryMonth: {
    type: String,
    required: false
  },
  leaveTaken: {
    type: Number,
    required: false
  },
  handledBy: {
    type: String,
    required: false
  },
  pettyCashType: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  propertyName: {
    type: String,
    required: false,
  },
  propertyId: {
    type: String,
    required: false, // Ensure propertyId is required
  },
  billImg: {
    type: String,
    required: false,
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: false,
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
