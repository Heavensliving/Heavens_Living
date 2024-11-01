const express = require("express")
const cafeOrderController = require('../controller/CafeOrderController');
const { verifyToken } = require("../middleware/tokenVerify");

const router = express.Router()

router.get('/', verifyToken, cafeOrderController.getAllCafeOrders);

router.get('/:id', verifyToken, cafeOrderController.getCafeOrderById);

router.post('/add', verifyToken, cafeOrderController.addCafeOrder);

router.put('/update/:id', verifyToken, cafeOrderController.updateCafeOrder);

router.delete('/delete/:id', verifyToken, cafeOrderController.deleteCafeOrder);

router.patch("/status/:id", verifyToken, cafeOrderController.changeOrderStatus);

router.get('/transaction/completed', verifyToken, cafeOrderController.getAllCompletedCafeOrders);

module.exports = router;