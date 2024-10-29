const mongoose = require("mongoose");

const Cafe = new mongoose.Schema(
  {
    itemname: { type: String, required: true },
    category: { type: String, required: true },
    itemId: { type: String, required: true, unique: true },
    itemCode: { type: String, required: false, unique: true },
    prize: { type: Number, required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "unavailable",
    },
  },
  { timestamps: true }
);

const CafeItemSchema = mongoose.model("CafeItemSchema", Cafe);

module.exports = CafeItemSchema;
