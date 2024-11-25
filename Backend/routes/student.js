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
const { addStudent, getAllStudents, editStudent, deleteStudent, vacateStudent, getStudentById, getStudentByStudentId, updateWarningStatus, currentStatus, updateBlockStatus } = require('../controller/studentController');
const { verifyToken } = require('../middleware/tokenVerify');

const router = express.Router();

// Define routes
router.post('/add', verifyToken, addStudent);
router.get('/', verifyToken, getAllStudents);
router.get('/:id', verifyToken, getStudentById);
router.get('/studentId/:studentId', verifyToken, getStudentByStudentId);
router.put('/:studentId/warning', verifyToken, updateWarningStatus);
router.patch('/:studentId/currentStatus', verifyToken, currentStatus);
router.patch('/block/:studentId', verifyToken, updateBlockStatus);
router.put('/edit/:id', verifyToken, editStudent); // Edit student route
router.delete('/vacate/:id', verifyToken, vacateStudent); // Delete student route
router.delete('/delete/:id', verifyToken, deleteStudent); // Delete student route

module.exports = router;
