const CafeItemSchema = require('../Models/CafeItemModel'); 

// Add a new food item
const addCafeItem = async (req, res) => {
  try {
    const { Itemname, prize, Description, image,quantity } = req.body;
    const newItem = new CafeItemSchema({ Itemname, prize, Description, image,quantity });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food item', error });
  }
};

// Get food item by ID
const getCafeItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const foodItem = await CafeItemSchema.findById(itemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve food item', error });
  }
};

// Get all food items
const getAllCafeItem = async (req, res) => {
  try {
    const foodItems = await CafeItemSchema.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve food items', error });
  }
};

// Update a food item
const updateCafeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await CafeItemSchema.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update food item', error });
  }
};

// Delete a food item
const deleteCafeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await CafeItemSchema.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food item', error });
  }
};

// Toggle food item status between 'available' and 'unavailable'
const toggleCafeItemStatus = async (req, res) => {
  try {
    const itemId = req.params.id;
    const foodItem = await CafeItemSchema.findById(itemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    foodItem.status = foodItem.status === 'available' ? 'unavailable' : 'available';
    const updatedItem = await foodItem.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update food item status', error });
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
