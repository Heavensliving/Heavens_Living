const jwt = require('jsonwebtoken');

const predefinedCredentials = {
  email: 'user@example.com', 
  password: 'password123',    
};

const JWT_SECRET = 'JWT_SECRET'; // Replace with a secure secret key

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Expecting email and password in the request body

    // Check if the entered credentials match the predefined ones
    if (email === predefinedCredentials.email && password === predefinedCredentials.password) {
      // Generate JWT token
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' }); 

      return res.status(200).json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to login user', error });
  }
};

module.exports = {
  loginUser,
};
