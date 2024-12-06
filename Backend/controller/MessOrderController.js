const crypto = require('crypto');
const MessOrder = require('../Models/MessOrderModel');
const Property = require('../Models/Add_property');
const Student = require('../Models/Add_student');
const adOnOrder = require('../Models/AdonOrder');

const generateOrderId = () => {
  const randomNumbers = crypto.randomInt(10000, 100000);
  return `HVNSO${randomNumbers}`;
};

// Add an order
const addOrder = async (req, res) => {
  try {
    const { name, roomNo, contact, mealType, student, property, adOns = [], deliverDate, status } = req.body;
    let totalPrice = 0;

    if (adOns.length > 0) {
      adOns.forEach((adOn) => {
        if (adOn.price && adOn.quantity) {
          totalPrice += adOn.price * adOn.quantity;
        }
      });
    }

    const orderId = generateOrderId();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    const newOrder = new MessOrder({
      name,
      orderId,
      roomNo,
      contact,
      mealType,
      status,
      adOns,
      totalPrice,
      student,
      property,
      deliverDate
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

const addAdonOrder = async (req, res) => {
  try {
    const { items, totalAmount, contact, status, student } = req.body;

    // Calculate total based on item quantity and rate if needed
    const calculatedTotalAmount = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);

    if (calculatedTotalAmount !== totalAmount) {
      return res.status(400).json({ message: 'Total amount does not match calculated amount.' });
    }

    // Create new order
    const newOrder = new adOnOrder({
      items,
      totalAmount: calculatedTotalAmount,
      contact,
      status,
      student,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Adon order added successfully', order: newOrder });
  } catch (error) {
    console.error('Error adding adon order:', error);
    res.status(500).json({ message: 'Error adding adon order', error });
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
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    // Find the order by orderId
    const order = await MessOrder.findOne({ orderId: orderId });

    if (!order) {
      console.log('order not found')
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is already delivered
    if (order.bookingStatus === 'delivered') {
      return res.status(400).json({ message: 'Order already delivered' });
    }

    // Update the status to 'delivered'
    order.bookingStatus = 'delivered';
    const updatedOrder = await order.save();
    return res.status(200).json({ message: 'Order confirmed', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Error confirming order', error });
  }
};

const getStudentByOrderId = async (req, res) => {
  const { orderId } = req.params;
console.log(orderId)
  try {
    // Fetch the order by orderId
    const order = await MessOrder.findOne({ orderId }).populate('student');
    console.log(order)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve student details from the populated student field
    const student = order.student;
    console.log(student)

    if (!student) {
      return res.status(404).json({ message: 'Student not found for the given order' });
    }

    res.status(200).json({
      student
    });
  } catch (error) {
    console.error('Error fetching order or student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const MessOrderController = {
  addOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
  getOrder,
  addAdonOrder,
  getStudentByOrderId,

};

module.exports = MessOrderController;
