const crypto = require('crypto');
const MessOrder = require('../Models/MessOrderModel');

const generateOrderId = () => {
  const randomNumbers = crypto.randomInt(10000, 100000);
  return `HVNSO${randomNumbers}`;
};

// Add an order
const addOrder = async (req, res) => {
  try {
    const { name, roomNo, contact, mealType, propertyId, adOns = [] } = req.body; // Ensure adOns is an array

    const orderId = generateOrderId();

    const newOrder = new MessOrder({
      name,
      orderId,
      roomNo,
      contact,
      mealType,
      status: false, // Set default status to false
      propertyId,
      adOns, // Include adOns in the new order
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error adding order', error });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await MessOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await MessOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const order = await MessOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

// Update the status of an order
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await MessOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

const MessOrderController = {
  addOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
};

module.exports = MessOrderController;
