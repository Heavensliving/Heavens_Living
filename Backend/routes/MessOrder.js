const express = require('express');
const router = express.Router();
const MessOrderController = require('../controller/MessOrderController');


router.post('/add', MessOrderController.addOrder);

router.get('/', MessOrderController.getAllOrders);

router.get('/:id', MessOrderController.getOrderById);

router.delete('/delete-order/:id', MessOrderController.deleteOrder);

router.put('/update/:id', MessOrderController.updateOrderStatus);

module.exports = router;
