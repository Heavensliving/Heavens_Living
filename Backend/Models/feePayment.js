const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Custom format ID, not MongoDB ObjectId
  totalAmountToPay: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  advanceBalance: { type: Number, default: 0 },
  paymentClearedMonthYear: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  waveOff: { type: Number, default: 0 },
  waveOffReason: { type: String },
  transactionId: { type: String, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Net Banking', 'UPI'],
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
}, { timestamps: true });

const FeePayment = mongoose.model('FeePayment', FeePaymentSchema);

module.exports = FeePayment;
