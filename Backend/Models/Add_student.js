const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  parentName: { type: String, required: true },
  parentNumber: { type: String, required: true },
  course: { type: String },
  nonRefundableDeposit: { type: Number },
  refundableDeposit: { type: Number },
  monthlyRent: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Paid', enum: ['Pending', 'Paid'], }, 
  adharFrontImage: { type: String, required: false },  // Store Firebase URL
  adharBackImage: { type: String, required: false },   // Store Firebase URL
  photo: { type: String, required: false },            // Store Firebase URL
  hostelName: { type: String },
  roomType: { type: String },
  roomNo: { type: String },
  referredBy: { type: String, required: true },
  typeOfStay: { type: String },
  pgName: { type: String },
  studentId: { type: String, unique: true, required: true },
  joinDate: { type: Date, default: Date.now },  // Default join date to now
  currentStatus: { type: String },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: false },
  year: { type: String, required: false },
  collegeName: { type: String,required: false},
  parentOccupation: { type: String,required: false },
  workingPlace: { type: String,required: false },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  maintenance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintanance' }],
  messOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MessOrder' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeePayment' }],  // Tracks individual payment records
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
