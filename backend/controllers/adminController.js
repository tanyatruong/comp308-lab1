const Student = require('../models/Student');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');

// Create a new student (admin only)
exports.createStudent = async (req, res) => {
    try {
        const {
            studentNumber,
            firstName,
            lastName,
            email,
            password,
            address,
            city,
            phoneNumber,
            program,
            favoriteTopic,
            strongestSkill
        } = req.body;

        // Check if student already exists
        const studentExists = await Student.findOne({
            $or: [
                { email },
                { studentNumber }
            ]
        });

        if (studentExists) {
            return res.status(400).json({
                message: "Student already exists with this email or student number"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await Student.create({
            studentNumber,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            address,
            city,
            phoneNumber,
            program,
            favoriteTopic,
            strongestSkill
        });

        res.status(201).json({
            message: "Student created successfully",
            student: {
                id: student._id,
                studentNumber: student.studentNumber,
                email: student.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
};

// Get all students (admin only)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select('-password')
            .sort({ studentNumber: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
};

// Get students by course (admin only)
exports.getStudentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
            .populate('students', '-password');
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course.students);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching course students",
            error: error.message
        });
    }
};
