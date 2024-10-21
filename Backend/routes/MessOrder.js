const express = require('express');
const router = express.Router();
const MessOrderController = require('../controller/MessOrderController');

let io; // Declare a variable to hold the Socket.IO instance

// Function to set the Socket.IO instance
const setSocketIO = (socketIo) => {
  io = socketIo; // Assign the passed Socket.IO instance to the variable
};

// Route for adding a new order
router.post('/add', async (req, res) => {
    try {
      // Pass the req and res objects to the controller
      await MessOrderController.addOrder(req, res);
  
      // Once the order is successfully added, you can emit the event
      // Ensure to check that the status is 201 before emitting the event
      io.emit('orderUpdated', req.body); // Emit the event with the new order data
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(500).json({ error: 'Failed to add order' });
    }
  });
// Route for getting all orders
router.get('/', MessOrderController.getAllOrders);

// Route for getting an order by ID
router.get('/:id', MessOrderController.getOrderById);

// Route for deleting an order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const deletedOrder = await MessOrderController.deleteOrder(req.params.id);
    io.emit('orderDeleted', deletedOrder); // Emit an event when an order is deleted
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Route for updating an order's status
router.put('/update/:id', async (req, res) => {
  try {
    const updatedOrder = await MessOrderController.updateOrderStatus(req.params.id, req.body);
    io.emit('orderUpdated', updatedOrder); // Emit the event with the updated order data
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Export the router and the setSocketIO function
module.exports = { router, setSocketIO };
