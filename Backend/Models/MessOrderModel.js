const mongoose = require('mongoose');

const MessOrderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  orderId: { type: String, required: false, unique: true },
  roomNo: { type: String, required: true },
  contact: { type: String, required: true },
  mealType: { type: String, required: true },
  status: { type: Boolean, required: true },
  date: { type: Date, default: Date.now, required: false },
  adOns: {
    type: [
      {
        name: { type: String, required: false },
        quantity: { type: Number, required: false, default: 1 },
        _id: false
      }
    ],
    required: false,
    default: []
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  expiryDate: { type:String,required:false}

});

const MessOrder = mongoose.model('MessOrder', MessOrderSchema);

module.exports = MessOrder