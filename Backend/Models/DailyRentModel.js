const mongoose = require('mongoose');

const DailyRentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  DailyRent: { type: Number },
  adharFrontImage: { type: String,required:false }, 
  adharBackImage: { type: String ,required:false },  
  roomType: { type: String },
  roomNo: { type: String },
  typeOfStay: { type: String },
  paymentStatus: { type: String },
  pgName: { type:String },
  OccupantId: { type: String, unique: true, required: true },
  joinDate: { type: Date },
  currentStatus: { type: String },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  Occupation: { type: String },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
})

const DailyRent = mongoose.model('DailyRent', DailyRentSchema);

module.exports = DailyRent;