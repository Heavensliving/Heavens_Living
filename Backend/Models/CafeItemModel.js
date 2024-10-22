const mongoose = require('mongoose');

const Cafe = new mongoose.Schema({
  Itemname:{type:String,required:true},
  prize:{type:Number,required:true},
  Description:{type:String,required:true},
  image:{type:String,required:true},
  quantity:{type:Number,required:true},
  status: {
    type: String,
    enum: ['available', 'unavailable'], 
    default: 'unavailable', 
  },
})

const CafeItemSchema = mongoose.model('CafeItemSchema',Cafe);

module.exports =CafeItemSchema;