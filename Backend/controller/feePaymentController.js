const Student = require('../Models/Add_student');
const FeePayment = require('../Models/feePayment'); // Ensure the path is correct

// Function to add a fee payment
const addFeePayment = async (req, res) => {
  console.log(req.body)
  try {
    const {
      name,
      studentId, // custom unique ID
      totalAmountToPay,
      payingAmount,
      feeClearedMonthYear,
      waveOffAmount,
      paidDate,
      waveOffReason,
      transactionId,
      _id,
    } = req.body;

    let advanceBalance = 0;
    let balance = 0;
    if (payingAmount > totalAmountToPay) {
      advanceBalance = payingAmount - totalAmountToPay;
    } else{
      balance = totalAmountToPay - payingAmount;
    }


    // Create a new fee payment document
    const feePayment = new FeePayment({
      studentId, // Custom ID format
      name,
      totalAmountToPay,
      amountPaid: payingAmount,
      pendingBalance: balance,
      advanceBalance,
      paymentClearedMonthYear: feeClearedMonthYear,
      paymentDate: paidDate,
      waveOff: waveOffAmount,
      waveOffReason,
      transactionId,
      student: _id,
    });

    // Save fee payment to the database
    await feePayment.save();

    // Update Student's payment info
    await Student.findByIdAndUpdate(_id, {
      $push: { payments: feePayment._id },
    });

    res.status(201).json({ message: 'Fee payment added successfully', feePayment });
  } catch (error) {
    console.error('Error adding fee payment:', error);
    res.status(500).json({ message: 'Error adding fee payment', error });
  }
};


// Function to get all fee payments
const getAllFeePayments = async (req, res) => {
  try {
    const feePayments = await FeePayment.find();
    res.status(200).json(feePayments);
  } catch (error) {
    console.error('Error fetching fee payments:', error);
    res.status(500).json({ message: 'Error fetching fee payments', error });
  }
};

// Function to get fee payments by student ID
const getFeePaymentsByStudentId = async (req, res) => {
  try {
    console.log(req.params)
    const { studentId } = req.params;
    const feePayments = await FeePayment.find({ student: studentId });
    console.log(feePayments)

    if (feePayments.length === 0) {
      return res.status(404).json({ message: 'No fee payments found for this student ID' });
    }

    res.status(200).json(feePayments);
  } catch (error) {
    console.error('Error fetching fee payments by student ID:', error);
    res.status(500).json({ message: 'Error fetching fee payments by student ID', error });
  }
};

// Function to edit a fee payment
const editFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const feePayment = await FeePayment.findByIdAndUpdate(id, updatedData, { new: true });

    if (!feePayment) {
      return res.status(404).json({ message: 'Fee payment not found' });
    }

    res.status(200).json({ message: 'Fee payment updated successfully', feePayment });
  } catch (error) {
    console.error('Error updating fee payment:', error);
    res.status(500).json({ message: 'Error updating fee payment', error });
  }
};

// Function to delete a fee payment
const deleteFeePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const feePayment = await FeePayment.findByIdAndDelete(id);

    if (!feePayment) {
      return res.status(404).json({ message: 'Fee payment not found' });
    }

    res.status(200).json({ message: 'Fee payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee payment:', error);
    res.status(500).json({ message: 'Error deleting fee payment', error });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await FeePayment.find({ paymentStatus: 'pending' });

    if (pendingPayments.length === 0) {
      return res.status(404).json({ message: 'No pending payments found' });
    }

    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Error fetching pending payments', error });
  }
};
const getWaveOffPayments = async (req, res) => {
  try {
    // Find payments where waveOff amount is greater than 0
    const waveOffPayments = await FeePayment.find({ waveOff: { $gt: 0 } });

    if (waveOffPayments.length === 0) {
      return res.status(404).json({ message: 'No payments with wave-off amounts found' });
    }

    res.status(200).json(waveOffPayments);
  } catch (error) {
    console.error('Error fetching payments with wave-off amounts:', error);
    res.status(500).json({ message: 'Error fetching payments with wave-off amounts', error });
  }
};
const feePaymentController = {
  addFeePayment,
  getAllFeePayments,
  getFeePaymentsByStudentId,
  editFeePayment,
  deleteFeePayment,
  getPendingPayments,
  getWaveOffPayments,
};

module.exports = feePaymentController;
