const mongoose = require('mongoose');

const Category = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CafeItemSchema' }],
},
  { timestamps: true })

const CategorySchema = mongoose.model('CategorySchema', Category);

module.exports = CategorySchema;