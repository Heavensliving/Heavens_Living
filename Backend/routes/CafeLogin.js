const express = require('express');
const CafeLoginController = require("../controller/CafeLoginController")

const router = express.Router();

// Define routes
router.post('/login', CafeLoginController.loginUser);
router.post('/logout', CafeLoginController.logoutUser);


module.exports = router;