// const jwt = require('jsonwebtoken');
// const Student = require('../Models/Add_student'); 

// // Function to handle user login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if email exists in the database
//     const user = await Student.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Directly compare passwords (plain text)
//     if (password !== user.password) {
//       return res.status(400).json({ message: 'Invalid password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: { name: user.name, email: user.email, Id: user._id, studentId:user.studentId }
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Error during login', error });
//   }
// };

// module.exports = { login };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Student = require('../Models/Add_student'); 

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'anwar07sadath@gmail.com',
    pass: 'wzih djhh mipt vjyx' 
  },
});

// Function to handle forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Email content
    const resetLink = `http://localhost:3000/api/user/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'www.heavensliving@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ message: 'Error during forgot password', error });
  }
};

// Function to handle reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    // Update the user's password
    await Student.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during reset password:', error);

    // Token expiration or invalid token handling
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired' });
    }
    res.status(500).json({ message: 'Error during reset password', error });
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

    // Directly compare passwords (plain text)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, Id: user._id, studentId:user.studentId }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

module.exports = { forgotPassword, resetPassword ,login};
