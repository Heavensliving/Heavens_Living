const express = require('express');
const adOnController = require('../controller/adOnController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router()

router.post('/add-adOn', verifyToken, adOnController.addAdOn);
router.get('/', verifyToken, adOnController.showAdOns);
router.get('/getAddOn/:id', verifyToken, adOnController.getAdOnById);
router.put('/update-addOn/:id', verifyToken, adOnController.editAdOn);
router.delete('/:id', verifyToken, adOnController.deleteAdOn);
router.put('/:id/status', verifyToken, adOnController.updateAdOnStatus);

module.exports = router;
