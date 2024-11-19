const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema({
  name: { type: String, required: false },
  studentId: { type: String, required: true }, // Custom format ID, not MongoDB ObjectId
  monthlyRent: { type: Number, required: false },
  totalAmountToPay: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  advanceBalance: { type: Number, default: 0 },
  paymentClearedMonthYear: { type: String, required: false },
  paymentDate: { type: Date, required: true },
  waveOff: { type: Number, default: 0 },
  waveOffReason: { type: String, default:'' },
  transactionId: { type: String, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Net Banking', 'UPI'],
    required: true 
  },
  dailyRent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DailyRent', 
    required: false 
  },
  messPeople: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'peopleModel', 
    required: false 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: false 
  },
}, { timestamps: true });

const FeePayment = mongoose.model('FeePayment', FeePaymentSchema);

module.exports = FeePayment;
