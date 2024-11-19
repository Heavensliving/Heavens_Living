
const mongoose = require('mongoose');

// Commission entry schema
const commissionEntrySchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  amount: { type: Number, required: true },
  note: String,
  paymentType: { type: String, required: true },
  transactionId: { type: String },
  propertyId: {
    type: String,  
    required: true
  },
  propertyName: {
    type: String,  
    required: true
  },
});
const Commission = mongoose.model('Commission', commissionEntrySchema);

module.exports = Commission;


