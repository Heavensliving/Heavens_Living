const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantityType: { type: String, required: true },
  stockQty: { type: Number, required: true },
  usedQty: { type: Number, default: 0 },
  category: { type: String, required: false },
  lowAlertQty: { type: Number, required: false },
  adminName: { type: String, required: true },
  propertyName: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  myProperty: { type: String },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
