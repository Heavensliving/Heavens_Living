const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Main-Admin', 'Branch-Admin', 'Property-Admin'],
      required: true
    },
    properties: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Property',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        _id: false,
      }
    ]
  }, { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
