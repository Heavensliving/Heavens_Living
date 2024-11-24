const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Student = require('../Models/Add_student');
const PasswordReset = require('../Models/PasswordRest');
const { passwordResetTemplate } = require('../utils/emailTemplates');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'heavensliving@gmail.com',
    pass: 'pcuk cpfn ygav twjd'
  },
});

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    console.error('Token is missing');
    res.redirect(`${FRONTEND_BASE_URL}/link-expired`);
    return;
  }
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.userId;
  try {
    const user = await Student.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "student not found." });
    }
    await Student.findByIdAndUpdate(
      { _id: userId },
      { isVerified: true },
      { new: true }
    );
    res.redirect(`${FRONTEND_BASE_URL}/email-verification-success`);
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification link has expired' });
    }
    res.status(400).json({ message: 'Invalid verification link' });
  }
};


// Function to handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists in the database
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'This email is not verified. Please check your email to verify your account before logging in.',
      });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, Id: user._id, studentId: user.studentId },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};


// Function to handle forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'This email is not registered' });
    }

    const userId = user._id
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expiryTime = new Date(Date.now() + 3600000);

    const passwordReset = await PasswordReset.findOneAndUpdate(
      { userId }, // Find by userId
      {
        requestTime: new Date(),
        expiryTime,
        token: resetToken,
      },
      { upsert: true, new: true } // Create if not found, return updated document
    );

    const resetLink = `http://192.168.1.79:3000/api/user/reset-password/${resetToken}`;
    const emailHtml = passwordResetTemplate(resetLink);
    const mailOptions = {
      from: 'www.heavensliving@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ message: 'Error during forgot password', error });
  }
};

// Function to handle reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded
    const resetEntry = await PasswordReset.findOne({ userId: id });
    if (!resetEntry || resetEntry.token !== token) {
      // return res.redirect(`http://192.168.1.79:3002/reset-password`);
      return res.status(400).json({ message: "Reset link expired." });
    }

    res.redirect(`${FRONTEND_BASE_URL}/reset-password/${token}`);

  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      // return res.redirect(`http://localhost:5173/reset_password`);
      res.redirect(`${FRONTEND_BASE_URL}/link-expired`);
      // return res.status(400).json({ message: "Reset link has expired. Please request a new password reset." });
    }

    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
}

const verify_reset_password = async (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    console.log(id)
    const resetEntry = await PasswordReset.findOne({ userId: id });

    if (!resetEntry || resetEntry.token !== token) {
      res.redirect(`${FRONTEND_BASE_URL}/link-expired`);
      // return res.status(400).json({ message: "Reset link has expired. Please request a new password reset." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.findOneAndUpdate(
      { _id: id },
      { password: hashedPassword }
    );

    const reset = await PasswordReset.findOneAndUpdate(
      { userId: id }, // Match by userId in the PasswordReset schema
      { token: '' } // Clear the token
    );

    res.status(200).json({ message: "Password reset successfully." });

  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      res.redirect(`${FRONTEND_BASE_URL}/link-expired`);
      // return res.status(400).json({ message: "Reset token has expired. Please request a new password reset." });
    }

    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { forgotPassword, resetPassword, verify_reset_password, login, verifyEmail };
