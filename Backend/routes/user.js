const express = require('express');
const userLoginController = require('../controller/userLoginController')

const router = express.Router();


router.get('/verifyemail/:userId', userLoginController.verifyEmail);
router.post('/userLogin', userLoginController.login);
router.post('/forgot-password', userLoginController.forgotPassword);
router.get('/reset-password/:token',userLoginController.resetPassword);
router.post('/reset-password',userLoginController.verify_reset_password);


module.exports = router;