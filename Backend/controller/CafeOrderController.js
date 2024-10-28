const CafeItemSchema = require('../Models/CafeItemModel');
const CafeOrderSchema = require('../Models/CafeOrderModel'); 
const crypto = require('crypto');


const generateOrderId = () => {
  const randomNumber = crypto.randomInt(100000, 999999); 
  return `HVNSCO${randomNumber}`;
};

// Add a new order and update item quantity
const addCafeOrder = async (req, res) => {
  try {
    const { Name, Contact, Items, Extras } = req.body;
    const OrderId = generateOrderId(); // Generate unique OrderId

    // Loop through items and reduce the quantity
    for (const orderedItem of Items) {
      const item = await CafeItemSchema.findById(orderedItem.itemId);
      if (!item) {
        return res.status(404).json({ message: `Item ${orderedItem.itemId} not found` });
      }

      // Check if there's enough quantity
      if (item.quantity < orderedItem.quantity) {
        return res.status(400).json({ message: `Not enough quantity for ${item.Itemname}` });
      }

      // Reduce the quantity
      item.quantity -= orderedItem.quantity;
      await item.save();
    }

    // Create the new order
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
