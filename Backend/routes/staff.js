// routes/staff.js
const express = require('express');
const staffController = require('../controller/staffController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

router.post('/add', verifyToken, staffController.createStaff);
router.get('/', verifyToken, staffController.getStaffMembers);
router.get('/:id', verifyToken, staffController.getStaffById);
router.put('/edit/:id', verifyToken, staffController.updateStaff);
router.delete('/delete/:id', verifyToken, staffController.deleteStaff);

module.exports = router;
