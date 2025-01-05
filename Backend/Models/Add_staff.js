// Models/Add_staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  StaffId: { type: String, required: true, unique: true, },
  DOB: { type: Date, required: false },
  Contactnumber: { type: String, required: true },
  Address: {type: String, required: false},
  Email: { type: String, required: false },
  Type: {type: String, required: true},
  Photo: { type: String, required: false },
  Adharfrontside: { type: String, required: false },
  Adharbackside: { type: String, required: false },
  Salary: {type: String, required: false},
  joinDate: {type: Date, required: false},
  PaySchedule: {type: String, required: false},
  Status: {type: String, required: true},
  branch: {type: String, required: true},
  phase: {type: String, required: true},
  propertyName: {type: String, required: true},
  salaryPayments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
}
},{ timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);

// Corrected the export statement
module.exports = Staff;
