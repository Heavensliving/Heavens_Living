const express = require('express');
const feePaymentController = require('../controller/feePaymentController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

// Route to add a fee payment
router.post('/add', verifyToken, feePaymentController.addFeePayment);

// Route to get all fee payments
router.get('/', verifyToken, feePaymentController.getAllFeePayments);

// Route to get fee payments by student ID
router.get('/:studentId', verifyToken, feePaymentController.getFeePaymentsByStudentId);

// Route to edit a fee payment
router.put('/:id', verifyToken, feePaymentController.editFeePayment);

// Route to delete a fee payment
router.delete('/:id', verifyToken, feePaymentController.deleteFeePayment);

router.get('/payments/pendingPayments', verifyToken, feePaymentController.getPendingPayments);

router.get('/payments/waveoffpayments', verifyToken, feePaymentController.getWaveOffPayments);

module.exports = router;
