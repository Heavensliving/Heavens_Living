const mongoose = require('mongoose');

const adonOrderSchema = new mongoose.Schema({

  orderId: { type: String, required: false, unique: true },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      rate: { type: Number, required: true },
      total: { type: Number, required: true },
      _id: false,
    }
  ],
  totalAmount: { type: Number, required: true },
  contact: { type: String, required: true },
  status: { type: Boolean, required: true },
  date: { type: Date, default: Date.now, required: false },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
})

const adOnOrder = mongoose.model('adonOrderSchema',adonOrderSchema);

module.exports =adOnOrder;