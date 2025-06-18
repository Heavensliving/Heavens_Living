const express = require('express');
const router = express.Router();
const gymController = require('../controller/gymController');
const { verifyToken } = require('../middleware/tokenVerify');

router.post('/initialize-week', gymController.initializeSlotsForNext7Days);
router.post('/book', verifyToken,  gymController.bookSlot);                  // Book a slot
router.get('/slots/:date', verifyToken, gymController.getSlotsByDateWithAvailability);            // Get all slots for a date
router.get('/user-bookings/:userId', verifyToken, gymController.getUserBookings);
router.get('/dates', verifyToken, gymController.getAllDates);

module.exports = router;
//  192.168.1.91