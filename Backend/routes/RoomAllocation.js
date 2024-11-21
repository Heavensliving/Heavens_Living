const express = require('express');
const roomController = require('../controller/RoomAllocationController'); 
const router = express.Router();

router.post('/add', roomController.addRoom);

router.put('/editRoom/:id', roomController.updateRoom);

router.delete('/deleteRooms/:id', roomController.deleteRoom);

router.get('/', roomController.getAllRooms);

router.get('/:pgName', roomController.getRoomsByProperty);

router.get('/occupants/:id', roomController.getOccupants);

router.get('/get/:id', roomController.getRoomById);

module.exports = router;
