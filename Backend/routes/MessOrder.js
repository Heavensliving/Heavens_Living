const express = require('express');
const router = express.Router();
const MessOrderController = require('../controller/MessOrderController');
const { verifyToken } = require('../middleware/tokenVerify');

router.post('/add', verifyToken, MessOrderController.addOrder)

router.post('/add-onOrder', verifyToken, MessOrderController.addAdonOrder)

// Route for getting all orders
router.get('/', verifyToken, MessOrderController.getAllOrders);

// Route for getting an order by ID
router.get('/:id', verifyToken, MessOrderController.getOrderById);

// Route for deleting an order
router.delete('/delete-order/:id', verifyToken, MessOrderController.deleteOrder)

// Route for updating an order's status
router.put('/bookingStatus', verifyToken, MessOrderController.updateOrderStatus)

router.put('/AddOnsStatus/:orderId', verifyToken, MessOrderController.updateAddOnsStatus)

router.get('/user/orders', verifyToken, MessOrderController.getOrder)

router.get('/order/:orderId', verifyToken, MessOrderController.getStudentByOrderId);

// Export the router and the setSocketIO function
module.exports = router;
