const CafeItemSchema = require('../Models/CafeItemModel');
const crypto = require('crypto');

// Add a new food item
const addCafeItem = async (req, res) => {
  try {
    const { Itemname, prize, value, Description, image, quantity } = req.body; 
    

    const ItemId = 'HVNSCI' + crypto.randomInt(100000, 999999);

    const newItem = new CafeItemSchema({ 
      itemname: Itemname, 
      itemId: ItemId, 
      prize, 
      value, // Using separate value
      description: Description, 
      image, 
      quantity 
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food item', error });
  }
};

// Get food item by ItemId
const getCafeItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const foodItem = await CafeItemSchema.findOne({ itemId });
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    console.error('Error retrieving food item:', error);
    res.status(500).json({ message: 'Failed to retrieve food item', error: error.message });
  }
};

// Get all food items
const getAllCafeItem = async (req, res) => {
  try {
    const foodItems = await CafeItemSchema.find();
    res.status(200).json(foodItems);
  } catch (error) {
    console.error('Error retrieving food items:', error);
    res.status(500).json({ message: 'Failed to retrieve food items', error: error.message });
  }
};

// Update a food item by ItemId
const updateCafeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await CafeItemSchema.findOneAndUpdate(
      { itemId },
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ message: 'Failed to update food item', error: error.message });
  }
};

// Delete a food item by ItemId
const deleteCafeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await CafeItemSchema.findOneAndDelete({ itemId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).json({ message: 'Failed to delete food item', error: error.message });
  }
};

// Toggle food item status between 'available' and 'unavailable' by ItemId
const toggleCafeItemStatus = async (req, res) => {
  try {
    const itemId = req.params.id;
    const foodItem = await CafeItemSchema.findOne({ itemId });
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    foodItem.status = foodItem.status === 'available' ? 'unavailable' : 'available';
    const updatedItem = await foodItem.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error toggling food item status:', error);
    res.status(500).json({ message: 'Failed to update food item status', error: error.message });
  }
};

module.exports = {
  addCafeItem,
  getCafeItemById,
  getAllCafeItem,
  updateCafeItem,
  deleteCafeItem,
  toggleCafeItemStatus,
};
