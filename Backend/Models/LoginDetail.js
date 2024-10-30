const mongoose = require("mongoose");

const LoginDetails= new mongoose.Schema(
  {
    email: { type: String, required: true }, // to track user
    date: { type: Date, default: Date.now, required: true },
    loginTime: { type: Date, required: true },
    logoutTime: { type: Date },
  },
  { timestamps: true }
);

const LoginDetailSchema = mongoose.model("LoginDetailSchema",LoginDetails);

module.exports = LoginDetailSchema;
