// const Student = require('../Models/Add_student');
// const { bucket } = require('../Config/firebase'); // Adjust the path as necessary


// // Function to generate a unique student ID
// const generateStudentId = () => {
//   const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
//   return `HVNS${randomNumber}`; // Concatenate "HVNS" with the random number
// };
// // function to upload image
// const uploadImage = async (file) => {
//   const { originalname, buffer } = file;
//   const blob = bucket.file(originalname);
//   const blobStream = blob.createWriteStream({
//     metadata: {
//       contentType: file.mimetype,
//     },
//   });

//   return new Promise((resolve, reject) => {
//     blobStream.on('error', (error) => {
//       reject(error);
//     });

//     blobStream.on('finish', () => {
//       const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // Construct URL
//       resolve(url);
//     });

//     blobStream.end(buffer);
//   });
// };


// // Add student function
// const addStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       address,
//       contactNo,
//       email,
//       bloodGroup,
//       parentName,
//       parentNumber,
//       course,
//       advanceFee,
//       nonRefundableDeposit,
//       monthlyRent,
//       adharFrontImage, // Keep this if you want to store the path or URL later
//       adharBackImage,  // Keep this if you want to store the path or URL later
//       photo,           // Keep this if you want to store the path or URL later
//       hostelName,
//       roomType,
//       roomNo,
//       referredBy,
//       typeOfStay,
//       paymentStatus,
//       joinDate,
//       currentStatus,
//       password,
//       dateOfBirth,
//       gender,
//       year,
//       collegeName,
//       parentOccupation,
//       workingPlace,
//       branch,
//       phase,
//     } = req.body;

//     // Generate a unique student ID
//     const studentId = generateStudentId();

//     // Create a new student document
//     const student = new Student({
//       name,
//       address,
//       contactNo,
//       email,
//       bloodGroup,
//       parentName,
//       parentNumber,
//       course,
//       advanceFee,
//       nonRefundableDeposit,
//       monthlyRent,
//       adharFrontImage,
//       adharBackImage,
//       photo,
//       hostelName,
//       roomType,
//       roomNo,
//       referredBy,
//       typeOfStay,
//       paymentStatus,
//       studentId, // Use the generated student ID
//       joinDate,
//       currentStatus,
//       password,
//       dateOfBirth,
//       gender,
//       year,
//       collegeName,
//       parentOccupation,
//       workingPlace,
//       branch,
//       phase,
//     });

//     console.log(student);
//     await student.save();
//     res.status(201).json({ message: 'Student added successfully', student });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding student', error });
//   }
// };

// // Function to get all students
// const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching students', error });
//   }
// };

// // Function to edit a student
// const editStudent = async (req, res) => {
//   try {
//     const { id } = req.params; // Get student ID from the request parameters
//     const updatedData = req.body; // Get the updated student data from the request body

//     const student = await Student.findByIdAndUpdate(id, updatedData, { new: true }); // Update the student

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     res.status(200).json({ message: 'Student updated successfully', student });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating student', error });
//   }
// };

// // Function to delete a student
// const deleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params; // Get student ID from the request parameters

//     const student = await Student.findByIdAndDelete(id); // Delete the student

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting student', error });
//   }
// };

// module.exports = { addStudent, getAllStudents, editStudent, deleteStudent };







const Student = require('../Models/Add_student');
const bucket = require('../Config/firebase'); // Ensure the correct path to your Firebase config

// Function to upload an image to Firebase
const uploadImage = async (file) => {
  if (!file) throw new Error("File is required for upload."); // Ensure file is provided

  const { originalname, buffer } = file; // Destructure file properties
  const blob = bucket.file(originalname); // Create a reference to the file
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype, // Set content type
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      console.error("Upload Error:", error); // Log the error for debugging
      reject(error); // Reject the promise if there's an error
    });

    blobStream.on('finish', () => {
      const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // Construct URL
      resolve(url); // Resolve the promise with the URL
    });

    blobStream.end(buffer); // End the stream and upload the file
  });
};

// Function to generate a unique student ID
const generateStudentId = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
  return `HVNS${randomNumber}`; // Concatenate "HVNS" with the random number
};

// Add student function
const addStudent = async (req, res) => {
  try {
    const {
      name,
      address,
      contactNo,
      email,
      bloodGroup,
      parentName,
      parentNumber,
      course,
      advanceFee,
      nonRefundableDeposit,
      monthlyRent,
      hostelName,
      roomType,
      roomNo,
      referredBy,
      typeOfStay,
      paymentStatus,
      joinDate,
      currentStatus,
      password,
      dateOfBirth,
      gender,
      year,
      collegeName,
      parentOccupation,
      workingPlace,
      branch,
      phase,
    } = req.body;

    // Generate a unique student ID
    const studentId = generateStudentId();

    // Validate the existence of required images
    if (!req.files || !req.files.adharFrontImage || !req.files.adharBackImage || !req.files.photo) {
      return res.status(400).json({ message: 'Missing required images for upload' });
    }

    // Handle image uploads and store URLs
    const adharFrontImageUrl = await uploadImage(req.files.adharFrontImage[0]); // Upload front image
    const adharBackImageUrl = await uploadImage(req.files.adharBackImage[0]); // Upload back image
    const photoUrl = await uploadImage(req.files.photo[0]); // Upload student photo

    // Create a new student document
    const student = new Student({
      name,
      address,
      contactNo,
      email,
      bloodGroup,
      parentName,
      parentNumber,
      course,
      advanceFee,
      nonRefundableDeposit,
      monthlyRent,
      adharFrontImage: adharFrontImageUrl, // Store the uploaded image URL
      adharBackImage: adharBackImageUrl, // Store the uploaded image URL
      photo: photoUrl, // Store the uploaded image URL
      hostelName,
      roomType,
      roomNo,
      referredBy,
      typeOfStay,
      paymentStatus,
      studentId, // Use the generated student ID
      joinDate,
      currentStatus,
      password,
      dateOfBirth,
      gender,
      year,
      collegeName,
      parentOccupation,
      workingPlace,
      branch,
      phase,
    });

    console.log(student); // Log student data for debugging
    await student.save(); // Save the student to the database
    res.status(201).json({ message: 'Student added successfully', student });
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

// Export the functions for use in routes
module.exports = { addStudent, getAllStudents, editStudent, deleteStudent };
