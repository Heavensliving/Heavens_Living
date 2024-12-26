const InventoryCategoryModel = require('../Models/InventoryCategoryModel');

const addInventoryCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Check if category already exists
    const existingCategory = await InventoryCategoryModel.findOne({ name: categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create new category
    const newCategory = new InventoryCategoryModel({
      name: categoryName
    });

    await newCategory.save();

    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getInventoryCategories = async (req, res) => {
    try {
      const categories = await InventoryCategoryModel.find();
      res.status(200).json({ categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const deleteInventoryCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const category = await InventoryCategoryModel.findByIdAndDelete(categoryId);
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { addInventoryCategory, getInventoryCategories, deleteInventoryCategory };
