// Models/Add_staff.js
const mongoose = require('mongoose');

const MaintananceSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  issue:{ type:String, required:true},
  description:{type:String, required:true},
  AssignedTo:{type:String,required:true},
  Timeneeded:{type:String,required:true},
  Status:{ type:String,required:false,default:"Pending"},
  propertyId:{type:String,required:false}
});

const Maintanance = mongoose.model("Maintanance",MaintananceSchema );

module.exports = Maintanance;
