const express = require('express');
const DailyRentController = require('../controller/DailyRentController'); 

const router = express.Router();


router.post('/add', DailyRentController.addDailyRent);

router.get('/', DailyRentController.getAllDailyRent);

router.get('/:id', DailyRentController.getDailyRentById);

router.put('/update/:id', DailyRentController.updateDailyRent);

router.delete('/delete/:id', DailyRentController.deleteDailyRent);

module.exports = router;
