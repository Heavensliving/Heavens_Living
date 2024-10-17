const mongoose = require('mongoose');

const MessOrderSchema = new mongoose.Schema({

  name:{ type:String,required:true},
  orderId:{type:String,required:false,unique: true},
  roomNo:{type:String,required:true},
  contact:{type:String,required:true},
  mealType:{type:String,required:true},
  status:{type:Boolean,required:true},
  date:{type:Date,default: Date.now,required:false},
  propertyId:{type:String,required:true,required:false},
  adOns:{ type: [String],required: true, default: [],
  }
  
});

const MessOrder = mongoose.model('MessOrder',MessOrderSchema );

module.exports = MessOrder;
