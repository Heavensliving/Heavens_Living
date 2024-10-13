const mongoose = require('mongoose');

// Define the FeePayment schema
const FeePaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  hostelId: {
    type: String,
    required: true,
  },
  hostelName: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    unique: true, // Ensure transactionId is unique
  },
  monthYear: {
    type: String,
    required: true,
  },
  paidDate: {
    type: Date,
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  waveOff: {
    type: Number,
    default: 0,
  },
  waveOffReason: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Method to format the paid date
FeePaymentSchema.methods.formatPaidDate = function() {
  const day = String(this.paidDate.getDate()).padStart(2, '0');
  const month = String(this.paidDate.getMonth() + 1).padStart(2, '0');
  const year = this.paidDate.getFullYear();
  return `${day}-${month}-${year}`;
};

// Create the FeePayment model
const FeePayment = mongoose.model('FeePayment', FeePaymentSchema);

module.exports = FeePayment;
