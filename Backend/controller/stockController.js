const Stock = require('../Models/Stock');
const UsageLog = require('../Models/UsageLog');

// Add new stock

const addStock = async (req, res) => {
  try {
    const { itemName, quantityType, stockQty, usedQty, category, lowAlertQty, adminName, properties, myProperty } = req.body;

    // Ensure properties is an array of objects with id and name
    const formattedProperties = properties.map(property => ({
      id: property.id,
      name: property.name
    }));

    // Create new stock entry
    const newStock = new Stock({
      itemName,
      quantityType,
      stockQty,
      usedQty,
      category,
      lowAlertQty,
      adminName,
      propertyName: formattedProperties,
      myProperty,
    });

    // Save the new stock to the database
    await newStock.save();

    // Log the action with quantityType
    await logUsage(itemName, 'add stock', stockQty, adminName, formattedProperties, null, quantityType);

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
    const { itemId, additionalStock, adminName, properties } = req.body;

    // Validate input
    if (!itemId || additionalStock <= 0 || isNaN(additionalStock)) {
      return res.status(400).json({ message: 'Please enter a positive number to add stock.' });
    }

    // Find the stock item by ID
    const stock = await Stock.findById(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Update the stock quantity
    stock.stockQty += additionalStock;
    await stock.save();

    // Ensure properties is an array of objects
    const formattedProperties = properties.map(property => ({
      id: property.id,
      name: property.name
    }));

    // Log the action with quantityType
    await logUsage(stock.itemName, 'update stock', additionalStock, adminName, formattedProperties, null, stock.quantityType);

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating stock' });
  }
};





const updateDailyUsage = async (req, res) => {
  const { itemId, dailyUsage, adminName, properties, usageDate } = req.body;

  try {
    // Find the stock item by ID
    const stock = await Stock.findById(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Check if there is sufficient stock for the daily usage
    const availableStock = stock.stockQty - stock.usedQty;
    if (dailyUsage > availableStock) {
      return res.status(400).json({
        message: 'Insufficient available stock for entered quantity.',
      });
    }

    // Update the used quantity in the stock
    stock.usedQty += dailyUsage;
    await stock.save();

    // Ensure properties is an array of objects
    const formattedProperties = properties.map(property => ({
      id: property.id,
      name: property.name
    }));

    // Log the action with quantityType
    await logUsage(stock.itemName, 'update daily usage', dailyUsage, adminName, formattedProperties, usageDate, stock.quantityType);

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



const logUsage = async (itemName, action, qty, adminName, properties, usageDate = null, quantityType) => {
  try {
    // Ensure properties is an array of objects with id and name
    const formattedProperties = properties.map(property => ({
      id: property.id,
      name: property.name
    }));

    const logEntry = new UsageLog({
      itemName,
      action,
      qty,
      quantityType,
      date: new Date(),
      usageDate: usageDate ? new Date(usageDate) : new Date(),
      adminName,
      propertyName: formattedProperties // Pass the array of objects
    });

    await logEntry.save();
    console.log("Usage logged successfully!");
  } catch (error) {
    console.error("Error logging usage:", error);
  }
};






const getUsageLogs = async (req, res) => {
  try {
    const logs = await UsageLog.find().sort({ date: -1 }); // Fetch logs sorted by date
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching usage logs:', error);
    res.status(500).json({ message: 'Error fetching usage logs' });
  }
};

const editStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemName, quantityType, category, lowAlertQty, adminName, properties } = req.body;

    // Find the stock item by ID
    const stock = await Stock.findById(itemId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Update the stock details
    stock.itemName = itemName;
    stock.quantityType = quantityType;
    stock.category = category;
    stock.lowAlertQty = lowAlertQty;

    await stock.save();

    // Format properties for logging
    const formattedProperties = properties.map(property => ({
      id: property.id,
      name: property.name
    }));

    // Log the edit action
    await logUsage(itemName, 'edit stock', 0, adminName, formattedProperties);

    res.status(200).json({ message: 'Stock edited successfully' });
  } catch (error) {
    console.error('Error editing stock:', error);
    res.status(500).json({ message: 'Error editing stock' });
  }
};

module.exports = { addStock, getStocks, updateStock, updateDailyUsage, deleteStock, logUsage, getUsageLogs, editStock };
