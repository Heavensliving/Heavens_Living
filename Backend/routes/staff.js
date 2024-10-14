// routes/staff.js
const express = require('express');
const staffController = require('../controller/staffController');

const router = express.Router();

router.post('/add', staffController.createStaff);
router.get('/', staffController.getStaffMembers);
router.get('/:id', staffController.getStaffById);
router.put('/edit/:id', staffController.updateStaff);
router.delete('/delete/:id', staffController.deleteStaff);

module.exports = router;
