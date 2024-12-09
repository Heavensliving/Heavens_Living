
const mongoose = require('mongoose');

// Commission entry schema
const commissionEntrySchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  amount: { type: Number, required: true },
  note: String,
  paymentType: { type: String, required: true },
  transactionId: { type: String, required: false, default:''},
  propertyName: {
    type: String,  
    required: true
  },
},{ timestamps: true }
);
const Commission = mongoose.model('Commission', commissionEntrySchema);

module.exports = Commission;


