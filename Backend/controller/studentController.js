const Student = require('../Models/Add_student');
const crypto = require('crypto');

// Function to generate a unique student ID
const generateStudentId = () => {
  const randomNumber = crypto.randomInt(1000, 100000); // Generate a random number between 1000 and 9999
  return `HVNS${randomNumber}`;
};


// Add student function
const addStudent = async (req, res) => {
  try {

    // Generate a unique student ID
    const studentId = generateStudentId();

    // Create a new student document
    const student = new Student({
      ...req.body,
      studentId
    });
    await student.save(); // Save the student to the database
    res.status(201).json({ message: 'Student added successfully', student });
    // });
  } catch (error) {
    console.error('Error adding student:', error); // Log the error
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

  // const extractedToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  // if (!extractedToken || extractedToken.trim() === "") {
  //     return res.status(401).json({ message: "You are not logged in!" });
  // }

  // //verify token
  // jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
  //     if (err) {
  //         return res.status(400).json({ message: `${err.message}` })
  //     } else {
  //         const adminId = decrypted.id
  //         return;
  //     }
  // })

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

    const student = await Student.findByIdAndDelete(id); // Delete the student

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
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

// Export the functions for use in routes
module.exports = { addStudent, getAllStudents, editStudent, deleteStudent, vacateStudent, getStudentById };

