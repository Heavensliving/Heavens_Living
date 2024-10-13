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
  advanceFee: { type: Number },
  nonRefundableDeposit: { type: Number },
  monthlyRent: { type: Number },
  adharFrontImage: { type: String,required:false }, // Store Firebase URL
  adharBackImage: { type: String ,required:false },  // Store Firebase URL
  photo: { type: String,required:false},           // Store Firebase URL
  hostelName: { type: String },
  roomType: { type: String },
  roomNo: { type: String },
  referredBy: { type: String, required: true },
  typeOfStay: { type: String },
  paymentStatus: { type: String },
  studentId: { type: String, unique: true, required: true },
  joinDate: { type: Date },
  currentStatus: { type: String },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  year: { type: String, required: true },
  collegeName: { type: String },
  parentOccupation: { type: String },
  workingPlace: { type: String },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
