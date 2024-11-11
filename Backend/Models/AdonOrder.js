const mongoose = require('mongoose');

const adonOrderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  orderId: { type: String, required: false, unique: true },
  roomNo: { type: String, required: true },
  contact: { type: String, required: true },
  mealType: { type: String, required: true },
  status: { type: Boolean, required: true },
  date: { type: Date, default: Date.now, required: false },
  itemName:{type:String,required:true},
  quantity:{type:String,required:true},
})

const adOnOrder = mongoose.model('adonOrderSchema',adOnOrder);

module.exports =adOnOrder;