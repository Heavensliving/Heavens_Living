const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantityType: { type: String, required: true },
  stockQty: { type: Number, required: true },
  usedQty: { type: Number, default: 0 },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
