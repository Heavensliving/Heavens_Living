const express = require("express")
const cafeItemController = require('../controller/CafeItemController');
const { verifyToken } = require("../middleware/tokenVerify");

const router = express.Router()

router.get('/', cafeItemController.getAllCafeItem);

router.get('/:id', verifyToken, cafeItemController.getCafeItemById);

router.post('/Add', verifyToken, cafeItemController.addCafeItem);

router.put('/update/:id', verifyToken, cafeItemController.updateCafeItem);

router.delete('/delete/:id',verifyToken, cafeItemController.deleteCafeItem);

router.patch('/toggleStatus/:id', verifyToken, cafeItemController.toggleCafeItemStatus);

router.get('/code/:code', verifyToken, cafeItemController.getCafeItemByCode)

router.get('/cafe/lowstock', verifyToken, cafeItemController.getLowStockItems);

module.exports = router;