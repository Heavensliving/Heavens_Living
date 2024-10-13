// const express = require('express');
// const { addStudent, getAllStudents, editStudent, deleteStudent } = require('../components/studentController');

// const router = express.Router();

// // Define routes
// router.post('/add', addStudent);
// router.get('/', getAllStudents);
// router.put('/edit/:id', editStudent); // Edit student route
// router.delete('/delete/:id', deleteStudent); // Delete student route

// module.exports = router;





const express = require('express');
const upload = require('../Config/multer'); // Ensure the correct path to your Multer config
const { addStudent, getAllStudents, editStudent, deleteStudent } = require('../components/studentController');

const router = express.Router();

// Define routes
router.post('/add', upload.fields([
  { name: 'adharFrontImage', maxCount: 1 },
  { name: 'adharBackImage', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), addStudent); // Use Multer to handle file uploads when adding a student

router.get('/', getAllStudents);
router.put('/edit/:id', editStudent); // Edit student route
router.delete('/delete/:id', deleteStudent); // Delete student route

module.exports = router;
