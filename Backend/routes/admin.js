const express = require('express');
const { signup, login, adminLogout } = require('../controller/adminController');

const router = express.Router();

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', adminLogout);

module.exports = router;