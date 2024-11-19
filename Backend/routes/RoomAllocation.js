const express = require('express');
const roomController = require('../controller/RoomAllocationController'); 
const router = express.Router();

router.post('/addRooms', roomController.addRoom);

router.put('/updateRooms/:id', roomController.updateRoom);

router.delete('/deleteRooms/:id', roomController.deleteRoom);

router.get('/', roomController.getAllRooms);

router.get('/:id', roomController.getRoomById);

module.exports = router;
