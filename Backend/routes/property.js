const express = require('express');
const router = express.Router();
const propertyController = require('../controller/propertyController');
const { verifyToken } = require('../middleware/tokenVerify');

router.post('/add', verifyToken, propertyController.createProperty);
router.get('/', verifyToken, propertyController.getProperties);
router.get('/:id', verifyToken, propertyController.getPropertyById);
router.get('/properties/:id', verifyToken, propertyController.getPropertyForPhase);
router.put('/edit/:id', verifyToken, propertyController.updateProperty);
router.delete('/delete/:id', verifyToken, propertyController.deleteProperty);

module.exports = router;
