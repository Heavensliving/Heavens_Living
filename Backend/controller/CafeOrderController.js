const CafeOrder = require("../Models/CafeOrderModel");
const Item = require("../Models/CafeItemModel");
const crypto = require('crypto');

// Function to generate a unique order ID
const generateOrderId = () => {
  const randomNumber = crypto.randomInt(100000, 999999); 
  return `HVNSCO${randomNumber}`;
};

// Add a new cafe order
const addCafeOrder = async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { itemName, rate, quantity, discount, total, paymentMethod, creditorName, creditorPhoneNumber } = req.body;

    // Validate required fields
    if (!itemName || !rate || !quantity || !discount || !total || !paymentMethod) {
      return res.status(400).json({ message: "All fields except creditor info are required" });
    }

    // Validate creditorName and creditorPhoneNumber only for Credit payment method
    if (paymentMethod === "Credit") {
      if (!creditorName || !creditorPhoneNumber) {
        return res.status(400).json({ message: "Creditor name and phone number are required for Credit payment" });
      }
    }

    // Generate a unique order ID
    const OrderId = generateOrderId();

    // Find the item in the inventory
    const item = await Item.findOne({ itemname: itemName }); // Adjust this query as per your schema
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if enough quantity is available
    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    // Reduce the item's quantity
    item.quantity -= quantity;

    // Save the updated item back to the database
    await item.save();

    // Create a new order with the generated OrderId
    const newOrder = new CafeOrder({ ...req.body, OrderId }); // Spread req.body and add OrderId
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
    const { id } = req.params;
    // Add logic to update the status of the transaction
    // For example:
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        id,
        { status: 'completed' }, // or whatever the completed status is
        { new: true } // return the updated document
    );

    if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
} catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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



module.exports = {
  addCafeOrder,
  getAllCafeOrders,
  getCafeOrderById,
  updateCafeOrder,
  deleteCafeOrder,
  changeOrderStatus,
  getAllCompletedCafeOrders};
