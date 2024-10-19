const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({

  Name:{
    type:String,
    required:true
  },
  Location:{
    type:String,
    required:true,
  },
  BranchId:{
    type:String,
    required:true,
    unique: true
  },
  phase: [{type: mongoose.Schema.Types.ObjectId, ref: 'Phase'}],
})
  

const Branch = mongoose.model('Branch', BranchSchema);

module.exports = Branch;
