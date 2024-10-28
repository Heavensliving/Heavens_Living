const mongoose = require('mongoose');

const CafeLogin = new mongoose.Schema(
  {
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
  }
)

const CafeLoginSchema = mongoose.model('CafeloginSchema',CafeLogin);

module.exports = CafeLoginSchema;