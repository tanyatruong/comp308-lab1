const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const protect = require('./middleware/authMiddleware');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true 
}));

// Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Auth check endpoint
app.get('/api/auth/me', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: "Logged out successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});