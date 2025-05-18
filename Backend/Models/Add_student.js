const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: false },
  contactNo: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  bloodGroup: { type: String, required: false },
  parentName: { type: String, required: false },
  parentNumber: { type: String, required: false },
  course: { type: String, required: false },
  nonRefundableDeposit: { type: Number, required: true },
  refundableDeposit: { type: Number, required: true },
  depositPaid: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'Paid', enum: ['Pending', 'Paid'], },
  adharFrontImage: { type: String, required: false },  // Store Firebase URL
  adharBackImage: { type: String, required: false },   // Store Firebase URL
  photo: { type: String, required: false },            // Store Firebase URL
  roomType: { type: String, required: false },
  roomNo: { type: String, required: false },
  referredBy: { type: String, required: false },
  typeOfStay: { type: String, required: true },
  pgName: { type: String, required: true },
  studentId: { type: String, unique: true, required: true },
  joinDate: { type: Date, default: Date.now },
  currentStatus: { type: String, enum: ['checkedIn', 'checkedOut'], default: 'checkedIn' },
  warningStatus: { type: Number, enum: [0, 1, 2, 3], default: 0 },
  vacate: { type: Boolean, default: false },
  vacateDate: { type: Date,},
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: false },
  year: { type: String, required: false },
  collegeName: { type: String, required: false },
  parentOccupation: { type: String, required: false },
  workingPlace: { type: String, required: false },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  profileCompletionPercentage: { type: String, required: true, default: '10' },
  category: { type: String, enum: ['Basic', 'Standard', 'Premium'], default: 'Basic' },
  pendingAddOns: { type: Number, required: false, default: 0 },
  monthlyRent: { type: Number, required: true, default: 0 }, // Monthly rent
  pendingRent: { type: Number, default: 0 }, // Total pending rent
  accountBalance: { type: Number, default: 0 }, // Advance balance
  rentMonths: [
    {
      monthYear: String, // Example: "January 2025"
      paidAmount: { type: Number, default: 0 },
      waveOffAmount: { type: Number, default: 0 },
      status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
      _id: false
    }
  ],
  dateOfPayment: { type: Date, required: false },
  pendingSince: { type: Date, required: false },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
  maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintanance' }],
  messOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessOrder' }],
  cafeOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderByOccupant' }],
  addOnOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'adonOrderSchema' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeePayment' }],  // Tracks individual payment records
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
