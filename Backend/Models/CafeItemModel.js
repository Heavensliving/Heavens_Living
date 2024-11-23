const mongoose = require("mongoose");

const Cafe = new mongoose.Schema({
  itemname: { type: String, required: true },
  categoryName: { type: String, required: true },
  itemId: { type: String, required: true, unique: true },
  itemCode: { type: String, required: false,unique: false },
  prize: { type: Number, required: true },
  value: { type: Number, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  quantity: { type: Number, required: true },
  lowStock: { type: Number, required: true },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorySchema'
  }
}, { timestamps: true })

const CafeItemSchema = mongoose.model('CafeItemSchema', Cafe);

module.exports = CafeItemSchema;