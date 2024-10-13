const mongoose = require('mongoose');

// Commission entry schema
const commissionEntrySchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  amount: { type: Number, required: true },
  note: String,
  paymentType: { type: String, required: true },
  transactionId: { type: String }
});

// Commission schema
const commissionSchema = new mongoose.Schema({
  propertyId: {
    type: String,  // Property ID, typically stored as a string like "HVNSP0001"
    required: true
  },
  propertyName: {
    type: String,  // Property name, for additional context or display purposes
    required: true
  },
  commissions: [commissionEntrySchema] // Array of commission entries for the property
});

// Create the model
const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;
