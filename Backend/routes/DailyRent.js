const express = require('express');
const DailyRentController = require('../controller/DailyRentController'); 
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();


router.post('/add', verifyToken, DailyRentController.addDailyRent);

router.get('/', verifyToken,  DailyRentController.getAllDailyRent);

router.get('/:id', verifyToken,  DailyRentController.getDailyRentById);

router.put('/update/:id', verifyToken,  DailyRentController.updateDailyRent);

router.delete('/delete/:id', verifyToken,  DailyRentController.deleteDailyRent);

module.exports = router;
