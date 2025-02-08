// Middleware to check if user is an admin
const Student = require('../models/Student');

const adminCheck = async (req, res, next) => {
    try {
        const student = await Student.findById(req.user.id);
        
        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        if (student.email !== "admin@mycentennialcollege.ca") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Error checking admin status" });
    }
};

module.exports = adminCheck;