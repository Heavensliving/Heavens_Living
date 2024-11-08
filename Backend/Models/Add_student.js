const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: false },
  contactNo: { type: String, required: true ,unique:true},
  email: { type: String, required: true,unique:true },
  bloodGroup: { type: String, required: false },
  parentName: { type: String, required: false },
  parentNumber: { type: String, required: false },
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
  referredBy: { type: String, required: false },
  typeOfStay: { type: String },
  paymentStatus: { type: String },
  pgName: { type:String },
  studentId: { type: String, unique: true, required: true },
  joinDate: { type: Date },
  currentStatus: { type: String },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: false },
  year: { type: String, required: false },
  collegeName: { type: String },
  parentOccupation: { type: String },
  workingPlace: { type: String },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  maintenance: [{type: mongoose.Schema.Types.ObjectId, ref: 'Maintanance'}],
  messOrders: [{type: mongoose.Schema.Types.ObjectId, ref: 'MessOrder'}],
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
}
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
