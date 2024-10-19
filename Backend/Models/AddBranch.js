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

  }
})
  

const Branch = mongoose.model('Branch', BranchSchema);

module.exports = Branch;
