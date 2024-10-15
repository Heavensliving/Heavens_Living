// Models/Add_staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  StaffId: { type: String, required: true },
  DOB: { type: Date, required: true },
  Contactnumber: { type: String, required: true },
  Address: {type: String, required: true},
  Email: { type: String, required: false },
  Type: {type: String, required: true},
  Photo: { type: String, required: false },
  Adharfrontside: { type: String, required: false },
  Adharbackside: { type: String, required: false },
  Salary: {type: String, required: true},
  PaymentDate: {type: Date, required: true},
  PaySchedule: {type: String, required: true},
  Status: {type: String, required: true}
});

const Staff = mongoose.model("Staff", staffSchema);

// Corrected the export statement
module.exports = Staff;
