const express = require('express');
const userLoginController = require('../controller/userLoginController')

const router = express.Router();


router.post('/userLogin', userLoginController.login);

module.exports = router;