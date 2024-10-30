const express = require("express")
const cafeItemController = require('../controller/CafeItemController')

const router = express.Router()

router.get('/',cafeItemController.getAllCafeItem);

router.get('/:id',cafeItemController.getCafeItemById);

router.post('/Add',cafeItemController.addCafeItem);

router.put('/update/:id',cafeItemController.updateCafeItem);

router.delete('/delete/:id',cafeItemController.deleteCafeItem);

router.patch('/toggleStatus/:id',cafeItemController.toggleCafeItemStatus);

router.get('/code/:code',cafeItemController.getCafeItemByCode)

router.get('/cafe/lowstock', cafeItemController.getLowStockItems);

module.exports = router;