const CafeOrder = require("../Models/CafeOrderModel");
const Item = require("../Models/CafeItemModel");
const crypto = require('crypto');

const generateOrderId = () => {
  const randomNumber = crypto.randomInt(100000, 999999); 
  return `HVNSCO${randomNumber}`;
};

// Add a new cafe order
const addCafeOrder = async (req, res, next) => {
  try {
    const { items, discount, paymentMethod, creditorName, creditorPhoneNumber } = req.body;
    console.log(req.body)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and must not be empty" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    if (paymentMethod === "credit") {
      if (!creditorName || !creditorPhoneNumber) {
        return res.status(400).json({ message: "Creditor name and phone number are required for Credit payment" });
      }
    }

    const orderId = generateOrderId();

    let totalOrderAmount = 0;

    for (const item of items) {
      const { itemName, quantity } = item;

      const inventoryItem = await Item.findOne({ itemname: itemName });
      if (!inventoryItem) {
        return res.status(404).json({ message: `Item ${itemName} not found` });
      }

      if (inventoryItem.quantity < quantity) {
        return res.status(400).json({ message: `Not enough quantity available for ${itemName}` });
      }

      inventoryItem.quantity -= quantity;

      await inventoryItem.save();

      const itemTotal = inventoryItem.prize * quantity; 
      totalOrderAmount += itemTotal;

      item.rate = inventoryItem.prize; 
      item.total = itemTotal; 
    }

    const status = (paymentMethod === "cash" || paymentMethod === "account") ? "completed" : "pending";

    const newOrder = new CafeOrder({
      items: items, 
      orderId,
      total: totalOrderAmount, 
      discount,
      paymentMethod,
      status, 
      creditorName,
      creditorPhoneNumber
    });

    console.log(newOrder);
    await newOrder.save();

    res.status(201).json({ message: "Order added successfully", order: newOrder });
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    res.status(400).json({ message: "Error adding order", error });
  }
};

// Get all cafe orders
const getAllCafeOrders = async (req, res) => {
  try {
    const orders = await CafeOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error details
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get a cafe order by ID
const getCafeOrderById = async (req, res) => {
  try {
    const order = await CafeOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error); // Log the error details
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// Update a cafe order by ID
const updateCafeOrder = async (req, res) => {
  try {
    const order = await CafeOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error); // Log the error details
    res.status(400).json({ message: "Error updating order", error });
  }
};

// Delete a cafe order by ID
const deleteCafeOrder = async (req, res) => {
  try {
    const order = await CafeOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error); // Log the error details
    res.status(500).json({ message: "Error deleting order", error });
  }
};

// Change the status of a cafe order from pending to completed
const changeOrderStatus = async (req, res) => {
  try {
    const order = await CafeOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if the current status is pending
    if (order.status === "pending") {
      order.status = "completed";
      await order.save();
      res.status(200).json({ message: "Order status updated to completed", order });
    } else {
      res.status(400).json({ message: "Order status is not pending" });
    }
  } catch (error) {
    console.error("Error updating order status:", error); // Log the error details
    res.status(500).json({ message: "Error updating order status", error });
  }
};

module.exports = {
  addCafeOrder,
  getAllCafeOrders,
  getCafeOrderById,
  updateCafeOrder,
  deleteCafeOrder,
  changeOrderStatus,
};
