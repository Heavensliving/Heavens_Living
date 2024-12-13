// Models/Add_staff.js
const mongoose = require('mongoose');

const MaintananceSchema = new mongoose.Schema({
  Name: { type: String, required: false },
  issue: { type: String, required: true },
  description: { type: String, required: true },
  AssignedTo: { type: String, required: false },
  Timeneeded: { type: String, required: false },
  AssignedAt: { type: Date, required: false },
  ResolutionDate: { type: Date, required: false },
  Remarks:{type:String,required:false},
  Status:{ type:String,required:false,default:"Pending"},
  propertyId:{type:String,required:false},
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }
}, { timestamps: true });

const Maintanance = mongoose.model("Maintanance", MaintananceSchema);

module.exports = Maintanance;
