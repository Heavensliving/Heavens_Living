const mongoose = require('mongoose');

const DailyRentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: false },
  bloodGroup: { type: String, required: false },
  DailyRent: { type: Number,  required: true },
  photo: { type: String,required:false },
  adharFrontImage: { type: String,required:false }, 
  adharBackImage: { type: String ,required:false },  
  roomType: { type: String },
  roomNo: { type: String },
  typeOfStay: { type: String, required: false },
  paymentStatus: { type: String, default: 'Pending' },
  pgName: { type:String },
  OccupantId: { type: String, unique: true, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  days: { type: Number },
  totalRent: { type: Number },
  pendingRent: { type: Number, default: 0 }, // Total pending rent
  currentStatus: { type: String, default: 'Active'},
  vacate: { type: Boolean, default: false },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: true },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeePayment' }],  
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
}
})

const DailyRent = mongoose.model('DailyRent', DailyRentSchema);

module.exports = DailyRent;
