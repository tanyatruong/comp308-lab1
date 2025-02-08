const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find student
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return user data (excluding password)
        const userData = await Student.findById(student._id).select('-password');
        res.json(userData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
};