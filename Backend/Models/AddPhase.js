const mongoose = require('mongoose');

const PhaseSchema = new mongoose.Schema({

  Name:{
    type:String,
    required:true
  },
  Location:{
    type:String,
    required:true,
  },
  PhaseId:{
    type:String,
    required:true,
    unique: true

  }
})
  

const Phase = mongoose.model('Phase', PhaseSchema);

module.exports = Phase;
