const express = require('express');
const adOnController = require('../controller/adOnController');

const router = express.Router()

router.post('/add-adOn',adOnController.addAdOn);
router.get('/',adOnController.showAdOns);
router.get('/getAddOn/:id',adOnController.getAdOnById);
router.put('/update-addOn/:id',adOnController.editAdOn);
router.delete('/:id',adOnController.deleteAdOn);
router.put('/:id/status',adOnController.updateAdOnStatus);

module.exports = router;
