const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getMyCourses,
    getCourseWithStudents,
    enrollInCourse,
    dropCourse,
    updateCourse,
    getCourseSections,
    deleteCourse
} = require('../controllers/courseController');
const protect = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminMiddleware');

// All routes require authentication
router.use(protect);

// Student routes
router.get('/my-courses', getMyCourses);
router.put('/:id/enroll', enrollInCourse);
router.put('/:id/drop', dropCourse);
router.get('/sections/:courseCode', getCourseSections);

// Admin routes
router.post('/', adminCheck, createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseWithStudents);
router.put('/:id', adminCheck, updateCourse);
router.delete('/:id', adminCheck, deleteCourse);

module.exports = router;