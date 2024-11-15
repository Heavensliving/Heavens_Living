const express = require('express');
const router = express.Router();
const MessOrderController = require('../controller/MessOrderController');
const { verifyToken } = require('../middleware/tokenVerify');

let io;
// Function to set the Socket.IO instance
const setSocketIO = (socketIo) => {
  io = socketIo;
};

router.post('/add', verifyToken, async (req, res) => {
  try {
    const newOrder = await MessOrderController.addOrder(req, res);

    // Emit the new order if successfully returned from the controller
    if (newOrder) {
      io.emit('orderUpdated', newOrder); // Emit the new order
      // console.log('Emitting new order:', newOrder);
    } else {
      console.error('Failed to get the new order from the controller');
    }
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

router.post('/add-onOrder', verifyToken, MessOrderController.addAdonOrder)

// Route for getting all orders
router.get('/', verifyToken, MessOrderController.getAllOrders);

// Route for getting an order by ID
router.get('/:id', verifyToken, MessOrderController.getOrderById);

// Route for deleting an order
router.delete('/delete-order/:id', verifyToken, async (req, res) => {
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
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const updatedOrder = await MessOrderController.updateOrderStatus(req.params.id, req.body);
    if (updatedOrder) {
      io.emit('orderUpdated', updatedOrder); // Emit the updated order only if not null
      console.log('Emitting updated order:', updatedOrder);
    } else {
      console.error('Failed to update the order');
    }

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.get('/user/orders', verifyToken, MessOrderController.getOrder)

// Export the router and the setSocketIO function
module.exports = { router, setSocketIO };
