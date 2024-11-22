const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['mainAdmin', 'branchAdmin', 'propertyAdmin'], 
      required: true 
    },
  },{ timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
