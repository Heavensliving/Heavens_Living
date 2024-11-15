const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: false },
  contactNo: { type: String, required: false },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: false },
  parentName: { type: String, required: false },
  parentNumber: { type: String, required: false },
  course: { type: String, required: false },
  nonRefundableDeposit: { type: Number, required: true},
  refundableDeposit: { type: Number, required: true},
  monthlyRent: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Paid', enum: ['Pending', 'Paid'], }, 
  adharFrontImage: { type: String, required: false },  // Store Firebase URL
  adharBackImage: { type: String, required: false },   // Store Firebase URL
  photo: { type: String, required: false },            // Store Firebase URL
  hostelName: { type: String, required: true },
  roomType: { type: String, required: true},
  roomNo: { type: String, required: true},
  referredBy: { type: String, required: false},
  typeOfStay: { type: String, required: true},
  pgName: { type: String, required: true},
  studentId: { type: String, unique: true, required: true },
  joinDate: { type: Date, default: Date.now },
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
  addOnOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'adonOrderSchema' }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeePayment' }],  // Tracks individual payment records
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
