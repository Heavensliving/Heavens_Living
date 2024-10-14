const express = require('express');
const adOnController = require('../controller/adOnController');

const router = express.Router()

router.post('/add-adOn',adOnController.addAdOn);
router.get('/',adOnController.showAdOns);
router.put('/update-adOn',adOnController.editAdOn);
router.delete('/delete-adOn',adOnController.deleteAdOn);
router.put('/:id/status',adOnController.updateAdOnStatus);

module.exports = router;
