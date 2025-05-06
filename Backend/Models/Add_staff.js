// Models/Add_staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  StaffId: { type: String, required: true, unique: true, },
  DOB: { type: Date, required: false },
  Contactnumber: { type: String, required: true },
  Address: { type: String, required: false },
  Email: { type: String, required: false },
  Type: { type: String, required: true },
  Photo: { type: String, required: false },
  Adharfrontside: { type: String, required: false },
  Adharbackside: { type: String, required: false },
  salaryStatus: { type: String, default: "Pending", required: true },
  Salary: { type: Number, required: false },
  pendingSalary: { type: Number, default: 0 },
  advanceSalary: { type: Number, default: 0 },
  joinDate: { type: Date, required: false },
  PaySchedule: { type: String, required: false },
  Status: { type: String, required: true },
  branch: { type: String, required: true },
  phase: { type: String, required: true },
  propertyName: { type: String, required: true },
  salaryMonths: [
    {
      monthYear: String, // Example: "January 2025"
      paidAmount: { type: Number, default: 0 },
      salaryCut: { type: Number, default: 0 },
      status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
      _id: false
    }
  ],
  salaryPayments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }
}, { timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);

// Corrected the export statement
module.exports = Staff;
