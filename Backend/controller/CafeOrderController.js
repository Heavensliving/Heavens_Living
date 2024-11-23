const CafeOrder = require("../Models/CafeOrderModel");
const Item = require("../Models/CafeItemModel");
const crypto = require('crypto');
const Student = require("../Models/Add_student");
const OrderByOccupant = require("../Models/cafeOrderByOccupant");

const generateOrderId = () => {
  const randomNumber = crypto.randomInt(100000, 999999);
  return `HVNSCO${randomNumber}`;
};

// Add a new cafe order
const addCafeOrder = async (req, res, next) => {
  try {
    const { items, discount, paymentMethod, creditorName, creditorPhoneNumber } = req.body;

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
      const { id, itemName, quantity } = item;
      const inventoryItem = await Item.findOne({ _id: id });
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
      amountPayable = totalOrderAmount - discount

      item.rate = inventoryItem.prize;
      item.total = itemTotal;
    }

    const status = (paymentMethod === "cash" || paymentMethod === "account") ? "completed" : "pending";

    const newOrder = new CafeOrder({
      items: items,
      orderId,
      total: totalOrderAmount,
      amountPayable: amountPayable,
      discount,
      paymentMethod,
      status,
      creditorName,
      creditorPhoneNumber
    });
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


const getAllCompletedCafeOrders = async (req, res) => {
  try {
    // Fetch only orders with status "completed"
    const completedOrders = await CafeOrder.find({ status: "completed" });
    res.status(200).json(completedOrders);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Error fetching completed orders", error });
  }
};
const completeCafeOrder = async (req, res) => {
  try {
    // Find the order by ID and update the status
    const order = await CafeOrder.findByIdAndUpdate(
      req.params.id,
      { status: "completed" }, // Update the status to completed
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated to completed", order });
  } catch (error) {
    console.error("Error updating order status:", error); // Log the error details
    res.status(400).json({ message: "Error updating order status", error });
  }
};

const CafeOrderByOccupant = async (req, res, next) => {
  try {
    const { items, paymentMethod, occupant } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and must not be empty" });
    }

    const orderId = generateOrderId();

    let totalOrderAmount = 0;

    for (const item of items) {
      const { id, itemName, quantity } = item;
      const inventoryItem = await Item.findOne({ _id: id });
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

    const newOrder = new OrderByOccupant({
      items: items,
      orderId,
      total: totalOrderAmount,
      paymentMethod,
      status,
      occupant,
    });
    await newOrder.save();
    await Student.findByIdAndUpdate(occupant, { $push: { cafeOrders: newOrder._id } });
    res.status(201).json({ message: "Order added successfully", order: newOrder });
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    res.status(400).json({ message: "Error adding order", error });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const occupant = await Student.findById({ _id: id }).populate('cafeOrders', 'orderId items total paymentMethod status date')
    if (!occupant) {
      return res.status(404).json({ message: "occupant not found" });
    }
    res.json({ cafeOrders: occupant.cafeOrders || [] });
  } catch (error) {
    console.error('Error fetching cafe orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addCafeOrder,
  getAllCafeOrders,
  getCafeOrderById,
  updateCafeOrder,
  deleteCafeOrder,
  getAllCompletedCafeOrders,
  completeCafeOrder,
  CafeOrderByOccupant,
  getOrderHistory,
};
