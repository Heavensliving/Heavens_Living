const mongoose = require('mongoose');

const messManagementSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  breakfast: {
    type: [String],
    required: true,  // Make it required to ensure no empty meal plans
    default: [],
  },
  lunch: {
    type: [String],
    required: true,  // Make it required
    default: [],
  },
  dinner: {
    type: [String],
    required: true,  // Make it required
    default: [],
  },
},{ timestamps: true });

const MessManagement = mongoose.model('MessManagement', messManagementSchema);

module.exports = MessManagement;
