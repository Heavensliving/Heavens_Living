const express = require('express');
const carousalController = require('../controller/carousalController')


const router = express.Router();

router.get('/', carousalController.getAllCarousals);

router.post('/addCarousal', carousalController.addCarousal);

router.put('/updateCarousal/:id', carousalController.updateCarousal);

router.get('/:id', carousalController.getCarousalById);

router.delete('/deleteCarousal/:id', carousalController.deleteCarousal)

router.delete('/deleteImage/:id', carousalController.deleteCarousalImage)


module.exports = router;