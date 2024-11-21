const express = require('express');
const userLoginController = require('../controller/userLoginController')

const router = express.Router();


router.post('/userLogin', userLoginController.login);
router.post('/forgot-password', userLoginController.forgotPassword);
router.post('/reset-password',userLoginController.resetPassword);


module.exports = router;