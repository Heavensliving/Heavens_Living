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
const { addStudent, getAllStudents, editStudent, deleteStudent, vacateStudent, getStudentById, getStudentByStudentId } = require('../controller/studentController');

const router = express.Router();

// Define routes
router.post('/add',addStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.get('/studentId/:studentId', getStudentByStudentId);
router.put('/edit/:id', editStudent); // Edit student route
router.delete('/vacate/:id', vacateStudent); // Delete student route
router.delete('/delete/:id', deleteStudent); // Delete student route

module.exports = router;
