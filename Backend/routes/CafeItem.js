const express = require("express")
const cafeItemController = require('../controller/CafeItemController');
const { verifyToken } = require("../middleware/tokenVerify");

const router = express.Router()

router.get('/', verifyToken, cafeItemController.getAllCafeItem);

router.get('/get', verifyToken, cafeItemController.getAllCafeItemForApp);

router.get('/:id', verifyToken, cafeItemController.getCafeItemById);

router.post('/Add', verifyToken, cafeItemController.addCafeItem);

router.put('/update/:id', verifyToken, cafeItemController.updateCafeItem);

router.delete('/delete/:id',verifyToken, cafeItemController.deleteCafeItem);

router.patch('/toggleStatus/:id', verifyToken, cafeItemController.toggleCafeItemStatus);

router.get('/code/:code', verifyToken, cafeItemController.getCafeItemByCode)

router.get('/cafe/lowstock', verifyToken, cafeItemController.getLowStockItems);

router.get('/cafe/search', verifyToken, cafeItemController.searchCafeItemsByName);

module.exports = router;