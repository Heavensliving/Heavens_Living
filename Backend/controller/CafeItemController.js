const CafeItemSchema = require('../Models/CafeItemModel');
const crypto = require('crypto');
const CategorySchema = require('../Models/CategoryModel');

// Add a new cafe item
const addCafeItem = async (req, res) => {
    try {
        const { itemname, categoryName, prize, value, itemCode, description, image, quantity, category, lowStock } = req.body;

        const itemId = 'HVNSCI' + crypto.randomInt(100000, 999999);

        const newItem = new CafeItemSchema({
            itemname,
            categoryName,
            itemId,
            prize,
            value,
            itemCode,
            description,
            image,
            quantity,
            category,
            lowStock
        });
        
        const savedItem = await newItem.save();
        await CategorySchema.findByIdAndUpdate(category, { $push: { items: savedItem._id } });
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add cafe item', error });
    }
};

// Get food item by ItemId
const getCafeItemById = async (req, res) => {
  try {
    const _id = req.params.id;
    const foodItem = await CafeItemSchema.findOne({ _id });
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
    const updatedItemData = req.body;

    // Update the food item
    const updatedItem = await CafeItemSchema.findOneAndUpdate(
      { _id: itemId },
      updatedItemData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    const categoryId = updatedItem.category;

    // Update the category's items array if necessary
    await CategorySchema.findOneAndUpdate(
      { _id: categoryId },
      { $addToSet: { items: itemId } },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).json({ message: 'Failed to update food item', error: error.message });
  }
};


// Delete a food item by ItemId
const deleteCafeItem = async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedItem = await CafeItemSchema.findOneAndDelete({ _id });
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

// Get food item by itemCode
const getCafeItemByCode = async (req, res) => {
  try {
    const itemCode = req.params.code;
    const foodItem = await CafeItemSchema.findOne({ itemCode });
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    console.error('Error retrieving food item by itemCode:', error);
    res.status(500).json({ message: 'Failed to retrieve food item', error: error.message });
  }
}
const getLowStockItems = async (req, res) => {
  try {
    
    const foodItems = await CafeItemSchema.find();
    const lowStockItems = foodItems.filter(item => item.quantity <= item.lowStock);
    res.status(200).json(lowStockItems);
  } catch (error) {
    console.error('Error retrieving low stock items:', error);
    res.status(500).json({ message: 'Failed to retrieve low stock items', error: error.message });
  }
};


module.exports = {
  addCafeItem,
  getCafeItemById,
  getAllCafeItem,
  getLowStockItems, 
  updateCafeItem,
  deleteCafeItem,
  toggleCafeItemStatus,
  getCafeItemByCode,
};
