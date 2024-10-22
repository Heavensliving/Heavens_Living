const CafeOrderSchema = require('../Models/CafeOrderModel'); 
const crypto = require('crypto');

// Function to generate a random 5-digit number
const generateOrderId = () => {
  const randomNumber = crypto.randomInt(10000, 99999); // Generates a random number between 10000 and 99999
  return `HVNSCO${randomNumber}`;
};

// Add a new order
const addCafeOrder = async (req, res) => {
  try {
    const { Name, Contact, Items, Extras } = req.body;
    const OrderId = generateOrderId(); // Generate unique OrderId
    const newOrder = new CafeOrderSchema({ Name, OrderId, Contact, Items, Extras });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add order', error });
  }
};

// Get an order by ID
const getCafeOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await CafeOrderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order', error });
  }
};

// Get all orders
const getAllCafeOrders = async (req, res) => {
  try {
    const orders = await CafeOrderSchema.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error });
  }
};

// Update an order
const updateCafeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await CafeOrderSchema.findByIdAndUpdate(orderId, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error });
  }
};

// Delete an order
const deleteCafeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await CafeOrderSchema.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error });
  }
};

module.exports = {
  addCafeOrder,
  getCafeOrderById,
  getAllCafeOrders,
  updateCafeOrder,
  deleteCafeOrder,
};
