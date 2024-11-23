const CafeItemSchema = require('../Models/CafeItemModel');
const crypto = require('crypto');
const CategorySchema = require('../Models/CategoryModel');

// Add a new cafe item
const addCafeItem = async (req, res) => {
    try {
        const { itemname, status, categoryName, prize, value, itemCode, description, image, quantity, category, lowStock } = req.body;

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
            lowStock,
            status
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


// Get all food items with pagination
const getAllCafeItem = async (req, res) => {
  const { after, limit = 12, searchTerm } = req.query; // Add searchTerm

  try {
    // Initialize query object
    let query = {};

    // If there’s a search term, add text-matching conditions to the query
    if (searchTerm) {
      query.$or = [
        { itemname: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
        { itemCode: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // If there's a cursor, only fetch items after the specified `_id`
    if (after) {
      query._id = { ...query._id, $gt: after };
    }

    // Fetch items from database with applied query, sort, and limit
    const foodItems = await CafeItemSchema.find(query)
      .sort({ _id: 1 })
      .limit(Number(limit));

    // Determine the next cursor for pagination
    const lastItem = foodItems[foodItems.length - 1];
    const nextCursor = lastItem ? lastItem._id : null;

    // Respond with items and next cursor
    res.status(200).json({
      foodItems,
      nextCursor, // Cursor for the next page
    });
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

    const existingItem = await CafeItemSchema.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const previousCategoryId = existingItem.category;
    const newCategoryId = updatedItemData.category;

    const updatedItem = await CafeItemSchema.findByIdAndUpdate(
      itemId,
      updatedItemData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Food item not found after update' });
    }

    // If the category has changed, update the categories accordingly
    if (newCategoryId && newCategoryId !== previousCategoryId) {
      // Remove the item from the previous category
      await CategorySchema.findByIdAndUpdate(
        previousCategoryId,
        { $pull: { items: itemId } },
        { new: true }
      );

      // Add the item to the new category
      await CategorySchema.findByIdAndUpdate(
        newCategoryId,
        { $addToSet: { items: itemId } },
        { new: true }
      );
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
const searchCafeItemsByName = async (req, res) => {
  try {
    const { name } = req.query;  // Extract the 'name' query parameter

    // If no 'name' query parameter is provided
    if (!name) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Use a regular expression to search for items whose name contains the search term (case insensitive)
    const foodItems = await CafeItemSchema.find({
      itemname: { $regex: name, $options: 'i' }  // Case-insensitive search
    });

    // If no items are found, return a 404 response
    if (foodItems.length === 0) {
      return res.status(404).json({ message: 'No food items found' });
    }

    // If items are found, return them
    res.status(200).json(foodItems);
  } catch (error) {
    console.error('Error searching food items:', error);
    res.status(500).json({ message: 'Failed to retrieve food items', error: error.message });
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
  searchCafeItemsByName,
};
