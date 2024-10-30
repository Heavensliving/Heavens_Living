const mongoose = require("mongoose");

const CafeLogin = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const CafeLoginSchema = mongoose.model("CafeloginSchema", CafeLogin);

module.exports = CafeLoginSchema;
