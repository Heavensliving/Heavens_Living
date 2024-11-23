const express = require("express")
const cafeOrderController = require('../controller/CafeOrderController');
const { verifyToken } = require("../middleware/tokenVerify");

const router = express.Router()

router.get('/', verifyToken, cafeOrderController.getAllCafeOrders);

router.get('/:id', verifyToken, cafeOrderController.getCafeOrderById);

router.post('/add', verifyToken, cafeOrderController.addCafeOrder);

router.post('/occupant/add', verifyToken, cafeOrderController.CafeOrderByOccupant);

router.put('/update/:id', verifyToken, cafeOrderController.updateCafeOrder);

router.delete('/delete/:id', verifyToken, cafeOrderController.deleteCafeOrder);

router.put('/orders/status/:id', cafeOrderController.completeCafeOrder);

router.get('/transaction/completed', verifyToken, cafeOrderController.getAllCompletedCafeOrders);

router.get('/orderHistory/:id', cafeOrderController.getOrderHistory);

module.exports = router;