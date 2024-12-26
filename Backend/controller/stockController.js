const Stock = require('../Models/Stock');

// Add new stock
const addStock = async (req, res) => {
  try {
    const { itemName, quantityType, stockQty, usedQty, category } = req.body;

    const newStock = new Stock({
      itemName,
      quantityType,
      stockQty,
      usedQty,
      category, 
    });

    await newStock.save();
    res.status(201).json({ message: 'Stock added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding stock' });
  }
};


// Get all stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
   
    if (stocks.length === 0) {
      return res.status(404).json({ message: 'No stock details found' });
    }
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving stock data' });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { itemId, additionalStock } = req.body;

    // Validate inputs
    if (!itemId || additionalStock <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Find the stock item and update its stockQty
    const stock = await Stock.findById(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    stock.stockQty += additionalStock; // Add the additional stock
    await stock.save();

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating stock' });
  }
};

const updateDailyUsage = async (req, res) => {
  const { itemId, dailyUsage } = req.body;

  try {
    const stock = await Stock.findById(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Check if there's enough available stock for the daily usage
    const availableStock = stock.stockQty - stock.usedQty;
    if (dailyUsage > availableStock) {
      return res.status(400).json({
        message: 'Insufficient available stock for entered quantity',
      });
    }

    // Update the usedQty by adding dailyUsage
    stock.usedQty += dailyUsage;

    await stock.save();
    res.status(200).json({ message: 'Daily usage updated successfully' });
  } catch (error) {
    console.error('Error updating daily usage:', error);
    res.status(500).json({ message: 'Failed to update daily usage' });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find the stock item and delete it
    const stock = await Stock.findByIdAndDelete(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting stock' });
  }
};

module.exports = { addStock, getStocks, updateStock, updateDailyUsage, deleteStock };

