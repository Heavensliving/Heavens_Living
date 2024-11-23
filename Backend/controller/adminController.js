const Admin = require('../Models/Admin');;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passwordValidation = new RegExp(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*\s)(?=.*[\x00-\x7F])[\w\W]{8,18}$/
);

const JWT_SECRET = process.env.JWT_SECRET || "heavensliving";

exports.signup = async (req, res) => {
    console.log(req.body)
    const { name, email, password, role } = req.body;

    // Validate the password before any other operation
    if (!passwordValidation.test(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-18 characters long, contain at least one uppercase letter, one lowercase letter, one number, and must not contain spaces or Unicode characters.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await Admin.findOne({ email });
    
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered.",
            });
        }
    
        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
            role
        });
    
        await admin.save(); // Ensure to wait for the save operation
    
        res.status(201).json({
            message: "Admin signed up successfully!",
        });
    } catch (error) {
        console.error("Error saving admin:", error); // Log more specific error info
        res.status(500).json({ message: "Error creating Admin. Please try again later." });
    }
    
};

// login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res
                .status(404)
                .json({ errors: [{ field: "email", message: "You are not registered in the system." }] });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ errors: [{ field: "password", message: "Invalid credentials." }] });
        }

        // Generate JWT token
        const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '24h' });
        const adminName = admin.name;
        const role = admin.role;

        // Success response
        res.status(200).json({ token, adminName, role });
    } catch (error) {
        console.error("Error in login route:", error);
        res
            .status(500)
            .json({ message: "An error occurred. Please try again later." });
    }
};

exports.adminLogout = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
