const mongoose = require("mongoose");

const CafeOrder = new mongoose.Schema(
  {
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true },
        total: { type: Number, required: true },
        _id: false,
      }
    ],
    orderId: { type: String, required: true, unique: true },
    discount: { type: String, required: false },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "account", "credit"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    creditorName: { type: String, required: false },
    creditorPhoneNumber: { type: String, required: false },
    date: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const CafeOrderSchema = mongoose.model("CafeOrderSchema", CafeOrder);

module.exports = CafeOrderSchema;
