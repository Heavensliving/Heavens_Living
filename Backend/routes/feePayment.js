const express = require('express');
const feePaymentController = require('../controller/feePaymentController');

const router = express.Router();

// Route to add a fee payment
router.post('/add', feePaymentController.addFeePayment);

// Route to get all fee payments
router.get('/', feePaymentController.getAllFeePayments);

// Route to get fee payments by student ID
router.get('/:studentId', feePaymentController.getFeePaymentsByStudentId);

// Route to edit a fee payment
router.put('/:id', feePaymentController.editFeePayment);

// Route to delete a fee payment
router.delete('/:id', feePaymentController.deleteFeePayment);

router.get('/payments/pendingPayments', feePaymentController.getPendingPayments);

router.get('/payments/waveoffpayments', feePaymentController.getWaveOffPayments);

module.exports = router;
