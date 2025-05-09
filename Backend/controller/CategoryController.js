const { mongoose } = require('mongoose');
const CafeItemSchema = require('../Models/CafeItemModel');
const Category = require('../Models/CategoryModel');

// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body; 
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add category', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve categories', error });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve category', error });
  }
};

const getItemsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId).select('items');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Ensure all category items are ObjectId types using new keyword
    const itemIds = category.items.map(id => new mongoose.Types.ObjectId(id));

    const query = { _id: { $in: itemIds } };

    // Fetch all food items for the category without pagination
    const foodItems = await CafeItemSchema.find(query)
      .sort({ _id: 1 });
    res.status(200).json({
      foodItems,
    });
  } catch (error) {
    console.error('Error retrieving food items:', error);
    res.status(500).json({ message: 'Failed to retrieve food items', error: error.message });
  }
};





// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; 
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryById,
  getItemsByCategory,
  updateCategory,
  deleteCategory,
};
