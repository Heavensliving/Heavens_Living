const jwt = require('jsonwebtoken');
const Student = require('../Models/Add_student'); 

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
      user: { name: user.name, email: user.email, studentId: user.studentId }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

module.exports = { login };
