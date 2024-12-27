const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "add stock", "update stock", "update daily usage"
  qty: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  adminName: { type: String },
  propertyName: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
});

const UsageLog = mongoose.model('UsageLog', usageLogSchema);

module.exports = UsageLog;
