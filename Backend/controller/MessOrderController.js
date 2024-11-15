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
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

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
      expiryDate,
    });

    const savedOrder = await newOrder.save();

    // Update Property and Student documents
    await Property.findByIdAndUpdate(property, { $push: { messOrders: savedOrder._id } });
    await Student.findByIdAndUpdate(student, { $push: { messOrders: savedOrder._id } });

    res.status(201).json(savedOrder);
    return savedOrder;

  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ message: 'Error adding order', error });
    return null;
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

// cron.schedule('0 0 * * *', async () => {
//   try {
//     const currentDate = new Date();
//     const result = await MessOrder.deleteMany({ expiryDate: { $lt: currentDate } });
//     console.log(`Deleted ${result.deletedCount} expired orders`);
//   } catch (error) {
//     console.error('Error deleting expired orders:', error);
//   }
// });
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
const getOrder = async (req, res, next) => {
  const studentId = req.query.student;
  try {
      const studentOrders = await MessOrder.find({ student: studentId })
      return res.status(200).json({ studentOrders });
  } catch (error) {
      return res.status(500).json({ message: "There was a problem retrieving the Bookings." });
  }
}


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
  getOrder,
  
};

module.exports = MessOrderController;
