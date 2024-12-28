const { mongoose } = require('mongoose');
const Student = require('../Models/Add_student');
const FeePayment = require('../Models/feePayment'); // Ensure the path is correct
const peopleModel = require('../Models/AddPeople');
const DailyRent = require('../Models/DailyRentModel');

// Function to add a fee payment
const addFeePayment = async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      studentId,
      monthlyRent,
      totalAmountToPay,
      payingAmount,
      feeClearedMonthYear,
      waveOffAmount,
      paidDate,
      waveOffReason,
      paymentMode,
      collectedBy,
      transactionId,
      _id,
      isMessPayment, // Field to differentiate payment type
      isDailyRent, // Field to handle daily rent payments
    } = req.body;
    // console.log(req.body)
    const student = _id;

    if (transactionId && transactionId !== null || '-') {
      const existingTransaction = await FeePayment.findOne({ transactionId });

      if (existingTransaction) {
        return res.status(400).json({
          message: "Transaction Id is already existed.",
        });
      }
    }

    // Calculate balances
    let advanceBalance = 0;
    let balance = 0;
    if (payingAmount > totalAmountToPay) {
      advanceBalance = payingAmount - totalAmountToPay;
    } else {
      balance = totalAmountToPay - payingAmount;
    }

    let feePaymentData = {
      studentId,
      monthlyRent,
      amountPaid: payingAmount,
      pendingBalance: isMessPayment || isDailyRent ? null : balance,
      advanceBalance,
      waveOffAmount,
      paymentDate: paidDate,
      paymentClearedMonthYear: feeClearedMonthYear,
      transactionId: transactionId || null,
      paymentMode,
      collectedBy,
      student,
    };

    if (isDailyRent) {
      // Handle daily rent payments
      const dailyRentPerson = await DailyRent.findOne({ OccupantId: studentId });
      if (!dailyRentPerson) {
        return res.status(404).json({ message: 'Daily rent person not found' });
      }

      // Add daily-rent-specific fields to feePaymentData
      feePaymentData.name = dailyRentPerson.name;
      feePaymentData.dailyRentAmount = dailyRentPerson.DailyRent;
      feePaymentData.dailyRent = dailyRentPerson._id;

      // Save the fee payment record
      const feePayment = new FeePayment(feePaymentData);
      await feePayment.save();

      const updateData = {
        $push: { payments: feePayment._id },
        $inc: { payingAmount: payingAmount },
      };

      // Add totalAmount to updateData only if waveOffAmount has a value
      if (waveOffAmount) {
        updateData.totalAmount = totalAmountToPay;
      }

      const updatedPayingAmount = dailyRentPerson.payingAmount + payingAmount;
      const totalAmount = waveOffAmount ? totalAmountToPay : dailyRentPerson.totalAmount;

      if (updatedPayingAmount >= totalAmount) {
        updateData.paymentStatus = "Paid"; 
      }

      // Update daily rent person payments
      await DailyRent.findByIdAndUpdate(
        dailyRentPerson._id,
        updateData,
        { new: true }
      );

      return res.status(201).json({ message: 'Daily rent payment added successfully', feePayment });
    }

    // Handle mess payments
    if (isMessPayment) {
      const messPeople = await peopleModel.findOne({ studentId: studentId });
      if (!messPeople) {
        return res.status(404).json({ message: 'Mess person not found' });
      }

      // Add mess-specific fields to feePaymentData
      feePaymentData.name = messPeople.name;
      feePaymentData.monthlyRent = messPeople.monthlyRent;
      feePaymentData.messPeople = messPeople._id;

      // Save the fee payment record
      const feePayment = new FeePayment(feePaymentData);
      await feePayment.save();

      // Update mess people payments
      await peopleModel.findByIdAndUpdate(
        messPeople._id,
        { $push: { payments: feePayment._id } },
        { new: true }
      );

      return res.status(201).json({ message: 'Mess fee payment added successfully', feePayment });
    }

    // Handle student payments
    feePaymentData.name = name;
    feePaymentData.monthlyRent = monthlyRent;
    feePaymentData.totalAmountToPay = totalAmountToPay;
    feePaymentData.paymentClearedMonthYear = feeClearedMonthYear;
    feePaymentData.waveOff = waveOffAmount;
    feePaymentData.waveOffReason = waveOffReason;
    feePaymentData.student = _id;

    // Save the fee payment record
    const feePayment = new FeePayment(feePaymentData);
    await feePayment.save();

    // Update Student model for student payments
    const updateData = { $push: { payments: feePayment._id } };

    // Update payment status if fully paid
    if (payingAmount >= totalAmountToPay) {
      updateData.paymentStatus = 'Paid';
      updateData.isBlocked = false;
    }

    await Student.findByIdAndUpdate(_id, updateData, { new: true });

    res.status(201).json({ message: 'Student fee payment added successfully', feePayment });
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

const getFeePaymentsByRenterId = async (req, res) => {
  try {
    // console.log(req.params)
    const { renterId } = req.params;
    const feePayments = await FeePayment.find({ dailyRent: renterId });
    // console.log(feePayments)

    if (feePayments.length === 0) {
      return res.status(404).json({ message: 'No fee payments found for this ID' });
    }

    res.status(200).json(feePayments);
  } catch (error) {
    console.error('Error fetching fee payments by renter ID:', error);
    res.status(500).json({ message: 'Error fetching fee payments by renter ID', error });
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
    // Find students and mess people with a payment status of "Pending"
    const students = await Student.find({ paymentStatus: 'Pending' });
    const messPeople = await peopleModel.find({ paymentStatus: 'Pending' });

    if (students.length === 0 && messPeople.length === 0) {
      return res.status(200).json([]);
    }

    // Array to store the student details along with their pending rent amount
    const pendingPaymentsDetails = await Promise.all([
      // Handling students
      ...students.map(async (student) => {
        const latestPayment = await FeePayment.findOne({ student: student._id })
          .sort({ createdAt: -1 })
          .lean();

        const today = new Date();
        const joinDate = new Date(student.joinDate);
        const joinDay = joinDate.getDate();

        let unpaidMonths = 0;
        let advanceBalance = latestPayment ? latestPayment.advanceBalance || 0 : 0;
        let waveOffAmount = latestPayment ? latestPayment.waveOff || 0 : 0;

        if (latestPayment && latestPayment.paymentClearedMonthYear) {
          const [clearedMonth, clearedYear] = latestPayment.paymentClearedMonthYear.split(', ');
          const clearedDate = new Date(`${clearedYear}-${clearedMonth}-01`);
          clearedDate.setDate(joinDay);

          unpaidMonths = (today.getFullYear() - clearedDate.getFullYear()) * 12 + (today.getMonth() - clearedDate.getMonth());
          if (today.getDate() < clearedDate.getDate()) {
            unpaidMonths--;
          }
        } else {
          unpaidMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
          if (today.getDate() < joinDate.getDate()) {
            unpaidMonths--;
          }
        }

        const monthlyRent = student.monthlyRent || 0;
        const totalRentDue = unpaidMonths * monthlyRent;

        let pendingRentAmount = totalRentDue + (latestPayment ? latestPayment.pendingBalance || 0 : 0) - waveOffAmount - advanceBalance;

        if (pendingRentAmount < 0) {
          advanceBalance = Math.abs(pendingRentAmount);
          pendingRentAmount = 0;
        } else {
          advanceBalance = 0;
        }

        return {
          studentId: student.studentId,
          name: student.name,
          room: student.roomNo,
          monthlyRent,
          unpaidMonths,
          pendingRentAmount,
          advanceBalance,
          waveOffAmount,
          lastPaidDate: latestPayment ? latestPayment.paymentDate : null,
          paymentClearedMonthYear: latestPayment ? latestPayment.paymentClearedMonthYear : null,
        };
      }),

      // Handling mess people
      ...messPeople.map(async (person) => {
        const latestPayment = await FeePayment.findOne({ messPeople: person._id })
          .sort({ createdAt: -1 })
          .lean();
        const today = new Date();
        const joinDate = new Date(person.joinDate);
        const joinDay = joinDate.getDate();

        let unpaidMonths = 0;
        let advanceBalance = latestPayment ? latestPayment.advanceBalance || 0 : 0;
        let waveOffAmount = latestPayment ? latestPayment.waveOff || 0 : 0;

        if (latestPayment && latestPayment.paymentClearedMonthYear) {
          const [clearedMonth, clearedYear] = latestPayment.paymentClearedMonthYear.split(', ');
          const clearedDate = new Date(`${clearedYear}-${clearedMonth}-01`);
          clearedDate.setDate(joinDay);

          unpaidMonths = (today.getFullYear() - clearedDate.getFullYear()) * 12 + (today.getMonth() - clearedDate.getMonth());
          if (today.getDate() < clearedDate.getDate()) {
            unpaidMonths--;
          }
        } else {
          unpaidMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
          if (today.getDate() < joinDate.getDate()) {
            unpaidMonths--;
          }
        }

        const monthlyRent = person.monthlyRent || 0;
        const totalRentDue = unpaidMonths * monthlyRent;

        let pendingRentAmount = totalRentDue + (latestPayment ? latestPayment.pendingBalance || 0 : 0) - waveOffAmount - advanceBalance;

        if (pendingRentAmount < 0) {
          advanceBalance = Math.abs(pendingRentAmount);
          pendingRentAmount = 0;
        } else {
          advanceBalance = 0;
        }

        return {
          studentId: person.studentId,
          name: person.name,
          monthlyRent,
          unpaidMonths,
          pendingRentAmount,
          advanceBalance,
          waveOffAmount,
          lastPaidDate: latestPayment ? latestPayment.paymentDate : null,
          paymentClearedMonthYear: latestPayment ? latestPayment.paymentClearedMonthYear : null,
        };
      }),
    ]);
    res.status(200).json(pendingPaymentsDetails);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Error fetching pending payments', error });
  }
};


const getWaveOffPayments = async (req, res) => {
  try {
    // Find payments where waveOff amount is greater than 0
    const waveOffPayments = await FeePayment.find({ waveOff: { $gt: 0 } });
    res.status(200).json(waveOffPayments);
  } catch (error) {
    console.error('Error fetching payments with wave-off amounts:', error);
    res.status(500).json({ message: 'Error fetching payments with wave-off amounts', error });
  }
};

const getTotalMonthlyRent = async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find({ vacate: false }, 'monthlyRent'); // Only selecting monthlyRent field
    const messPeople = await peopleModel.find({ vacate: false }, 'monthlyRent');

    const totalMonthlyRentStudents = students.reduce((acc, student) => {
      return acc + (student.monthlyRent || 0); // Default to 0 if monthlyRent is undefined
    }, 0);

    const totalMonthlyRentMess = messPeople.reduce((acc, mess) => {
      return acc + (mess.monthlyRent || 0); // Default to 0 if monthlyRent is undefined
    }, 0);

    res.status(200).json({ totalMonthlyRentStudents, totalMonthlyRentMess });
  } catch (error) {
    console.error("Error calculating total monthly rent:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const feePaymentController = {
  addFeePayment,
  getAllFeePayments,
  getFeePaymentsByStudentId,
  getFeePaymentsByRenterId,
  editFeePayment,
  deleteFeePayment,
  getPendingPayments,
  getWaveOffPayments,
  getTotalMonthlyRent,
};

module.exports = feePaymentController;
