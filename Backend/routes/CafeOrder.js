const express = require("express")
const cafeOrderController = require('../controller/CafeOrderController');
const { verifyToken } = require("../middleware/tokenVerify");

const router = express.Router()

router.post('/occupant/add', verifyToken, cafeOrderController.CafeOrderByOccupant);

router.get('/', cafeOrderController.getAllCafeOrders);

router.put('/orders/:id/status', cafeOrderController.changeOrderStatus);

router.delete('/delete/:id', verifyToken, cafeOrderController.deleteCafeOrder);

router.get('/:id', verifyToken, cafeOrderController.getCafeOrderById);

router.post('/add', verifyToken, cafeOrderController.addCafeOrder);

router.put('/update/:id', verifyToken, cafeOrderController.updateCafeOrder);

router.put('/orders/status/:id', cafeOrderController.completeCafeOrder);

router.get('/transaction/completed', verifyToken, cafeOrderController.getAllCompletedCafeOrders);

router.get('/orderHistory/:id', cafeOrderController.getOrderHistory);

module.exports = router;