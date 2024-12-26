const mongoose = require("mongoose");

const InvestmentSchema= new mongoose.Schema(
  {
    name: {type: String , required:true},
    propertyName: {type: String , required: true},
    propertyId: { type: String , required: true},
    type : {type: String, required: true},
    amount: {type: Number , required: true},


  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment",InvestmentSchema);

module.exports = Investment;
