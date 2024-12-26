const mongoose = require("mongoose");

const expenseCategory = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const expenseCategorySchema = mongoose.model("expenseCategorySchema",expenseCategory);

module.exports = expenseCategorySchema;
