const mongoose = require("mongoose");

const CafeOrder = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    OrderId: { type: String, required: true, unique: true },
    rate: { type: String, requied: true },
    quantity: { type: String, required: true },
    discount: { type: String, required: true },
    total: { type: String, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Account", "Credit"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    creditorName:{type:String,required:false},
    creditorPhoneNumber:{type:String,required:false},

    Date: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const CafeOrderSchema = mongoose.model("CafeOrderSchema", CafeOrder);

module.exports = CafeOrderSchema;
