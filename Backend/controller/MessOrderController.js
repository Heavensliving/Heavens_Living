const crypto = require('crypto');
const MessOrder = require('../Models/MessOrderModel');
const Property = require('../Models/Add_property');
const Student = require('../Models/Add_student');

const generateOrderId = () => {
  const randomNumbers = crypto.randomInt(10000, 100000);
  return `HVNSO${randomNumbers}`;
};

// Add an order
const addOrder = async (req, res) => {
  try {
    const { name, roomNo, contact, mealType, student, property, adOns = [] } = req.body; 

    const orderId = generateOrderId();

    const newOrder = new MessOrder({
      name,
      orderId,
      roomNo,
      contact,
      mealType,
      status: false,
      adOns,
      student, 
      property,
    });

    const savedOrder = await newOrder.save();
    await Property.findByIdAndUpdate(property, { $push: { messOrders: savedOrder._id } });
    await Student.findByIdAndUpdate(student, { $push: { messOrders: savedOrder._id } });
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
