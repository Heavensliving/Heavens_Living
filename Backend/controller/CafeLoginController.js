const jwt = require('jsonwebtoken');
const LoginDetailSchema = require("../Models/LoginDetail");

const predefinedCredentials = {
  email: 'heavens@gmail.com', 
  password: 'Heavens@123',
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== predefinedCredentials.email) {
      return res.status(401).json({ message: 'Email not found' });
    }

    if (password !== predefinedCredentials.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (email === predefinedCredentials.email && password === predefinedCredentials.password) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

      const loginTime = new Date();

      // Save login details to the database
      const loginRecord = new LoginDetailSchema({
        email,
        date: loginTime,
        loginTime,
      });
      await loginRecord.save();
      return res.status(200).json({ message: 'Login successful', token, email });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to login staff', error });
  }
};

// Logout a user
const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the latest login record for this email
    const loginRecord = await LoginDetailSchema.findOne({ email }).sort({ createdAt: -1 });

    if (!loginRecord) {
      return res.status(404).json({ message: "Login record not found" });
    }

    loginRecord.logoutTime = new Date(); // Set the logout time
    await loginRecord.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout user", error });
  }
};

module.exports = {
  loginUser,
  logoutUser,
};
