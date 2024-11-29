const mongoose = require('mongoose');

const MessOrderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  orderId: { type: String, required: false, unique: true },
  roomNo: { type: String, required: false },
  contact: { type: String, required: true },
  mealType: { type: String, required: true },
  status: { type: String, required: true, default: null },
  bookingStatus: { type: String, required: true, default: 'Pending' },
  bookingDate: { type: Date, default: Date.now, required: false },
  deliverDate: { type: Date, required: false },
  adOns: {
    type: [
      {
        name: { type: String, required: false },
        quantity: { type: Number, required: false, default: 1 },
        price: { type: Number, required: false, default: 0 },
        _id: false
      }
    ],
    required: false,
    default: []
  },
  totalPrice: { type: Number, required: false, default: 0 },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  messPeople: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'peopleModel'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  expiryDate: { type:String,required:false}

},{ timestamps: true });

const MessOrder = mongoose.model('MessOrder', MessOrderSchema);

module.exports = MessOrder