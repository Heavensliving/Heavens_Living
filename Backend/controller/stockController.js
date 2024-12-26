const Stock = require('../Models/Stock');

// Add new stock
const addStock = async (req, res) => {
  try {
    const { itemName, quantityType, stockQty, usedQty } = req.body;

    const newStock = new Stock({
      itemName,
      quantityType,
      stockQty,
      usedQty,
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
  

// Export the functions correctly
module.exports = { addStock, getStocks, updateStock };
