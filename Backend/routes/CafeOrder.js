const express = require("express")
const cafeOrderController = require('../controller/CafeOrderController')

const router = express.Router()

router.get('/',cafeOrderController.getAllCafeOrders);

router.get('/:id',cafeOrderController.getCafeOrderById);

router.post('/Add',cafeOrderController.addCafeOrder);

router.put('/update/:id',cafeOrderController.updateCafeOrder);

router.delete('/delete/:id',cafeOrderController.deleteCafeOrder);

module.exports = router;