const expenseCategorySchema = require("../Models/expense-category");

const addCategory = async (req, res) => {
    try {
      const { name, type } = req.body; 
      const newCategory = new expenseCategorySchema({ name, type });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add category', error });
    }
  };
  
  // Get all categories
  const getAllCategories = async (req, res) => {
    try {
      const categories = await expenseCategorySchema.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve categories', error });
    }
  };
  
  module.exports = {
    addCategory,
    getAllCategories,
  };
  