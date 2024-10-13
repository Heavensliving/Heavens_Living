// Models/Add_staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  EmployeeId: { type: String, required: true },
  DOB: { type: Number, required: true },
  Contactnumber: { type: Number, required: true },
  Email: { type: String, required: false },
  Photo: { type: String, required: false },
  Adharfrontside: { type: String, required: false },
  Adharbackside: { type: String, required: false }
});

const Staff = mongoose.model("Staff", staffSchema);

// Corrected the export statement
module.exports = Staff;
