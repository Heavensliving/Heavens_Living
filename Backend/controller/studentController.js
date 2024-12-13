const { default: mongoose } = require('mongoose');
const Property = require('../Models/Add_property');
const Student = require('../Models/Add_student');
const crypto = require('crypto');
const FeePayment = require('../Models/feePayment');
const Maintanance = require('../Models/MaintanenceModel')


// Function to generate a unique student ID
const generateStudentId = () => {
  const randomNumber = crypto.randomInt(1000, 100000);
  return `HVNS${randomNumber}`;
};

// Add student function
const addStudent = async (req, res) => {
  const propertyId = req.body.property;
  console.log(req.body);

  try {
    // Generate a unique student ID
    const studentId = generateStudentId();

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const { phaseName, branchName } = property;

    // Create a new student document, relying on default values for fields like paymentStatus
    const student = new Student({
      ...req.body,
      studentId,
      phase: phaseName,
      branch: branchName,
      property: propertyId
    });

    await student.save();

    // Update the property to include the new student
    await Property.findByIdAndUpdate(propertyId, { $push: { occupanets: student._id } });
    
    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Error adding student', error: error.message || error });
  }
};



// Function to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students from the database
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error); // Log the error
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Function to get a students
 const getStudentById = async (req, res, next) => {

  const studentId = req.params.id;
  let result;
  try {
      result = await Student.findById(studentId);
      if (!result)
          return res.status(404).json({ message: 'Student with the given ID does not exist.' });

  } catch (err) {
      return res.status(500).json({ message: "Error occured in fetching the student" })
  }
  return res.status(200).json({ result });
};

// Function to edit a student
const editStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from the request parameters
    const updatedData = req.body; // Get the updated student data from the request body

    const student = await Student.findByIdAndUpdate(id, updatedData, { new: true }); // Update the student

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error); // Log the error
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Function to delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from the request parameters
    const propertyId = req.query.propertyId; // Get propertyId as a string from query params

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    const student = await Student.findByIdAndDelete(id); // Delete the student

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Find the property and update it by removing the student's ID from the array
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { occupanets: id } }, // Remove the student ID from the students array
      { new: true } // Return the updated document
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully and removed from property' });
  } catch (error) {
    console.error('Error deleting student:', error); // Log the error
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

const vacateStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from the request parameters

    // Find the student and update their status to 'vacated'
    const student = await Student.findByIdAndUpdate(
      id,
      { currentStatus: 'vacated' }, // Update the status field to 'vacated'
      { new: true } // Return the updated document
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student status updated to vacated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student status', error });
  }
};
const calculateTotalFee = async (req, res) => {
  try {
    // Fetch all students and select only the 'fee' field
    const students = await Student.find({}, 'monthlyRent');

    // Calculate the grand total of all fees
    const grandTotal = students.reduce((total, student) => total + (student.monthlyRent || 0), 0);

    res.status(200).json({ message: 'Grand total calculated successfully', grandTotal });
  } catch (error) {
    console.error('Error calculating total fee:', error);
    res.status(500).json({ message: 'Error calculating total fee', error });
  }
};


// Controller function to get student details by studentId
const getStudentByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId })
      .populate('property maintenance messOrders')
      .populate('payments');

    if (!student) {
      return res.status(404).json({ message: 'Student not found. Please check the Student ID.' });
    }

    const { name, monthlyRent, pgName, _id } = student;
    const joinDate = new Date(student.joinDate);
    const joinDay = joinDate.getDate(); // Get the exact join day

    // Get the latest payment document
    const latestPayment = student.payments.length > 0 ? student.payments[student.payments.length - 1] : null;

    const latestPaidDate = latestPayment ? new Date(latestPayment.paymentDate) : null;
    const feeClearedMonthYear = latestPayment ? latestPayment.paymentClearedMonthYear : null;
    const waveOffAmount = latestPayment ? latestPayment.waveOff || 0 : 0;
    let advanceBalance = latestPayment ? latestPayment.advanceBalance || '' : '';
    let pendingBalance = latestPayment ? latestPayment.pendingBalance || '' : '';
    console.log(pendingBalance)

    const today = new Date();
    let unpaidMonths = 0;

    // Construct the last cleared date using feeClearedMonthYear and the student's join day
    if (feeClearedMonthYear) {
      const [clearedMonth, clearedYear] = feeClearedMonthYear.split(', ');
      const clearedDate = new Date(`${clearedYear}-${clearedMonth}-01`);
      clearedDate.setDate(joinDay); // Set to join day

      // Adjust unpaid months calculation
      unpaidMonths = (today.getFullYear() - clearedDate.getFullYear()) * 12 + (today.getMonth() - clearedDate.getMonth());
      if (today.getDate() < clearedDate.getDate()) {
        unpaidMonths--;
      }
    } else {
      // If no cleared date, calculate unpaid months from the original join date
      unpaidMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
      if (today.getDate() < joinDate.getDate()) {
        unpaidMonths--;
      }
    }

    // Calculate total due rent for unpaid months
    let totalRentDue = unpaidMonths * monthlyRent;

    // Account for any payments, wave-offs, and advance balance
    let pendingRentAmount = totalRentDue + (latestPayment ? latestPayment.pendingBalance : '') - waveOffAmount - advanceBalance;
    console.log(pendingRentAmount)

    // Adjust for pending amount or excess advance balance
    if (pendingRentAmount < 0) {
      // advanceBalance = Math.abs(pendingRentAmount);
      pendingRentAmount = '';
    } else {
      advanceBalance = '';
    }

    res.status(200).json({
      name,
      monthlyRent,
      pgName,
      joinDate: joinDate.toLocaleDateString(),
      latestPaidDate: latestPaidDate ? latestPaidDate.toLocaleDateString() : null,
      feeClearedMonthYear,
      unpaidMonths,
      pendingRentAmount,
      advanceBalance,
      pendingBalance,
      _id
    });
  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({ message: 'Error retrieving student', error: error.message || error });
  }
};


// Export the functions for use in routes
module.exports = { addStudent, getAllStudents, editStudent, deleteStudent, vacateStudent, getStudentById, calculateTotalFee, getStudentByStudentId};

