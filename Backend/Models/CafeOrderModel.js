const mongoose = require('mongoose');

const CafeOrder = new mongoose.Schema({
  Name:{type:String, required:true},
  OrderId:{type:String, required:true, unique: true},
  Contact:{type:String, requires:true},
  Items:{type:String, required:true},
  Date:{type:Date, default: Date.now, required:true},
  Extras:{type:String, required:true}
})

const CafeOrderSchema = mongoose.model('CafeOrderSchema',CafeOrder);

module.exports =CafeOrderSchema;