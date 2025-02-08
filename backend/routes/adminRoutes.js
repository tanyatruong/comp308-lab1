const express = require('express');
const router = express.Router();
const {createStudent, getAllStudents, getStudentsByCourse } = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminMiddleware');

// All routes need both authentication and admin privileges
router.use(protect);
router.use(adminCheck);

// Student Management by admin
router.post('/students', createStudent);
router.get('/students', getAllStudents);
router.get('/courses/:courseId/students', getStudentsByCourse);

module.exports = router;