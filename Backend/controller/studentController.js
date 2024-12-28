const Property = require('../Models/Add_property');
const Student = require('../Models/Add_student');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const FeePayment = require('../Models/feePayment');
const Maintanance = require('../Models/MaintanenceModel')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'heavensliving@gmail.com',
    pass: 'pcuk cpfn ygav twjd'
  },
});

// Function to generate a unique student ID
const generateStudentId = () => {
  const randomNumber = crypto.randomInt(1000, 100000);
  return `HVNS${randomNumber}`;
};
const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '24h' }); // Token expires in 24 hours
};
// Add student function
const addStudent = async (req, res) => {
  const propertyId = req.body.property;
  const roomNumber = req.body.roomNo; // Get the room number from the request
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(req.body);

  try {
    const studentId = generateStudentId();
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const { phaseName, branchName } = property;
    const room = await Rooms.findOne({ roomNumber, property: propertyId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.vacantSlot <= 0) {
      return res.status(400).json({ message: 'No vacant slots available in the selected room' });
    }
    const student = new Student({
      ...req.body,
      studentId,
      phase: phaseName,
      branch: branchName,
      property: propertyId,
      room: room._id,
      password: hashedPassword,
    });
    await student.save();
    room.occupanets.push(student._id);
    room.occupant += 1;
    room.vacantSlot -= 1;

    await room.save();
    await Property.findByIdAndUpdate(propertyId, { $push: { occupanets: student._id } });
    const token = generateVerificationToken(student._id);
    const link = `${BACKEND_BASE_URL}/user/verifyemail?token=${token}`
    const emailHtml = emailVerificationTemplate(link)
    const mailOptions = {
      from: 'www.heavensliving@gmail.com',
      to: student.email,
      subject: 'Email Verification',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
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
    result = await Student.findById(studentId).select('-password'); 
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
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    console.log("Updated Data:", updatedData); // Debugging log

    // Find the current student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the email has changed
    const emailChanged = updatedData.email && updatedData.email !== student.email;

    // Handle property changes
    if (updatedData.property && updatedData.property !== student.property.toString()) {
      const oldPropertyId = student.property;
      const newPropertyId = updatedData.property;

      // Remove the student from the old property's occupants
      await Property.findByIdAndUpdate(oldPropertyId, { $pull: { occupanets: student._id } });

      await Property.findByIdAndUpdate(newPropertyId, { $push: { occupanets: student._id } });
    }

    // Debug the roomNumber and property fields
    console.log("Room Number:", updatedData.roomNo);
    console.log("Property ID:", updatedData.property);

    if (updatedData.roomNo && updatedData.property) {
      const { roomNo, property } = updatedData;
      console.log("Room Number and Property:", roomNo, property);
      const newRoom = await Rooms.findOne({ roomNumber: roomNo, property });
      console.log("New Room:", newRoom);

      if (!newRoom) {
        return res.status(404).json({ message: 'Room not found for the given property and room number' });
      }

      if (student.room && student.room.toString() !== newRoom._id.toString()) {
        await Rooms.findByIdAndUpdate(student.room, {
          $pull: { occupanets: student._id },
          $inc: { occupant: -1, vacantSlot: 1 },
        });

        await Rooms.findByIdAndUpdate(newRoom._id, {
          $push: { occupanets: student._id },
          $inc: { occupant: 1, vacantSlot: -1 },
        });
        updatedData.room = newRoom._id;
      }
    }

    if (updatedData.paymentStatus && updatedData.paymentStatus === 'Paid') {
      console.log('here', updatedData.status)
      updatedData.isBlocked = false; // Set isBlocked to false if status is 'paid'
    }

    // Update the student's data
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send email verification if email has changed
    if (emailChanged) {
      const token = generateVerificationToken(updatedStudent._id);
      const link = `${BACKEND_BASE_URL}/user/verifyemail?token=${token}`
      const emailHtml = emailVerificationTemplate(link);
      const mailOptions = {
        from: 'www.heavensliving@gmail.com',
        to: updatedData.email,
        subject: 'Email Update Verification',
        html: emailHtml,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent to updated address:", updatedData.email);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message: 'Student updated but failed to send verification email',
          error: emailError.message || emailError
        });
      }
    }

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error); // Log the error
    res.status(500).json({ message: 'Error updating student', error });
  }
};





const currentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const newStatus = student.currentStatus === 'checkedIn' ? 'checkedOut' : 'checkedIn';
    student.currentStatus = newStatus;

    await student.save();

    res.status(200).json({
      message: `Student status updated to ${newStatus} successfully`,
      student
    });
  } catch (error) {
    console.error('Error updating student status:', error); // Log the error
    res.status(500).json({ message: 'Error updating student status', error });
  }
};

// Function to delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // Student ID from request parameters
    const propertyId = req.query.propertyId; // Property ID from query parameters
    const role = req.headers.role; // Role from headers

    // Validate the propertyId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    if (role === 'Property-Admin') {
      const student = await Student.findByIdAndUpdate(
        id,
        { vacate: true }, // Mark as vacated
        { new: true }
      );
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      if (student.room) {
        const room = await Rooms.findById(student.room);
        if (room) {
          room.occupanets = room.occupanets.filter(occupantId => occupantId.toString() !== id);

          if (room.occupant > 0) {
            room.occupant -= 1;
          }
          if (room.vacantSlot < room.roomCapacity) {
            room.vacantSlot += 1;
          }

          await room.save();
        }
      }

      return res.status(200).json({ message: 'Student marked as vacated and room updated successfully', student });
    }


    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.room) {
      const room = await Rooms.findById(student.room); // Assuming Room is the room model

      if (room) {

        room.occupanets = room.occupanets.filter(occupantId => occupantId.toString() !== id);

        if (room.occupant > 0) {
          room.occupant -= 1;
        }
        if (room.vacantSlot < room.roomCapacity) {
          room.vacantSlot += 1;
        }

        await room.save();
      }
    }
    await Student.findByIdAndDelete(id);
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { occupanets: id } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      message: 'Student deleted successfully and removed from property and room',
      updatedRoom: student.room ? await Rooms.findById(student.room) : null
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

const vacateStudent = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from the request parameters

    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove the student from their assigned room
    if (student.room) {
      const room = await Rooms.findById(student.room); // Assuming Room is a model representing rooms in the database

      if (room) {
        // Remove the student ID from the room's occupants array
        room.occupanets = room.occupanets.filter(occupantId => occupantId.toString() !== id);

        // Update occupant count and vacant slots
        if (room.occupant > 0) {
          room.occupant -= 1; // Decrement the occupant count
        }
        if (room.vacantSlot < room.roomCapacity) {
          room.vacantSlot += 1; // Increment the vacantSlot count
        }

        // Save the updated room
        await room.save();
      }
    }
    student.currentStatus = 'vacated';
    student.room = null; // Remove the room assignment
    await student.save();

    res.status(200).json({
      message: 'Student vacated successfully',
      student,
      updatedRoom: student.room ? await Rooms.findById(student.room) : null // Include updated room details if applicable
    });
  } catch (error) {
    res.status(500).json({ message: 'Error vacating student', error });
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
      unpaidMonths = 1
      // (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
      // if (today.getDate() < joinDate.getDate()) {
      //   unpaidMonths--;
      // }
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

const mongoose = require('mongoose');
const Rooms = require('../Models/RoomAllocationModel');
const { emailVerificationTemplate } = require('../utils/emailTemplates');

const updateWarningStatus = async (req, res) => {
  try {
    // Extract parameters and body
    const { studentId } = req.params;
    const { warningStatus } = req.body;

    // Validate warningStatus (ensure it's a valid number)
    const validStatuses = [0, 1, 2, 3];
    if (!validStatuses.includes(Number(warningStatus))) {
      return res.status(400).json({ message: 'Invalid warning status' });
    }

    // Ensure studentId format matches the database schema
    const query = mongoose.Types.ObjectId.isValid(studentId)
      ? { _id: studentId } // Match by MongoDB ObjectId if valid
      : { studentId }; // Match by custom `studentId` if it's not an ObjectId

    // Find the student in the database
    const student = await Student.findOneAndUpdate(
      query, // Query by `_id` or `studentId`
      { warningStatus: Number(warningStatus) }, // Update warning status
      { new: true } // Return the updated document
    );

    // Check if the student exists
    if (!student) {
      console.log(`No student found with ID: ${studentId}`);
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({
      message: 'Warning status updated successfully',
      student,
    });
  } catch (error) {
    console.error('Error updating warning status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBlockStatus = async (req, res) => {
  try {
    const { studentId } = req.params; // Get student ID from the request parameters
    console.log(studentId)
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Toggle the isBlocked field
    student.isBlocked = !student.isBlocked;

    // Save the updated student document
    await student.save();

    res.status(200).json({ message: 'Student block status updated successfully', student });
  } catch (error) {
    console.error('Error updating block status:', error);
    res.status(500).json({ message: 'Error updating block status', error });
  }
};


// Export the functions for use in routes
module.exports = { addStudent, getAllStudents, editStudent, updateWarningStatus, updateBlockStatus, currentStatus, deleteStudent, vacateStudent, getStudentById, calculateTotalFee, getStudentByStudentId };

