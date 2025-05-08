const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "add stock", "update stock", "update daily usage"
  qty: { type: Number, required: true },
  quantityType: { type: String, required: true }, // Added quantityType field
  date: { type: Date, default: Date.now }, // Log creation date
  usageDate: { type: Date }, // Date when the usage occurred
  adminName: { type: String },
  propertyName: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
});

const UsageLog = mongoose.model('UsageLog', usageLogSchema);

module.exports = UsageLog;
