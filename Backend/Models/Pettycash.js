const mongoose = require('mongoose');

const Pettycash = new mongoose.Schema({
  amount: { type: Number, required: true },
  staff: { type:String, required: true},
},
  { timestamps: true })

const PettycashSchema = mongoose.model('PettycashSchema', Pettycash)

module.exports = PettycashSchema;