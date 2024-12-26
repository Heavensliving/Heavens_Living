const mongoose = require('mongoose');

const inventorycategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
}, { timestamps: true });

const InventoryCategoryModel = mongoose.model('InventoryCategory', inventorycategorySchema);

module.exports = InventoryCategoryModel;
