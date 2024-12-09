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
    default: '',
    required: false
  },
  amount: {
    type: Number,
    required: true
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
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required:false,
}
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
