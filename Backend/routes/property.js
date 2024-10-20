const express = require('express');
const router = express.Router();
const propertyController = require('../controller/propertyController');

router.post('/add', propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/properties/:id',propertyController.getPropertyForPhase);
router.put('/edit/:id', propertyController.updateProperty);
router.delete('/delete/:id', propertyController.deleteProperty);

module.exports = router;
