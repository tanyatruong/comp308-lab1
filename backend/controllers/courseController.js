const Course = require('../models/Course');
const Student = require('../models/Student');

// Create a new course (admin)
exports.createCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;        
        const course = new Course({
            courseCode,
            courseName,
            section,
            semester
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};

// Get all courses (admin)
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};

// Get my courses (student)
exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            students: req.user.id
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your courses", error: error.message });
    }
};

// Get course by ID with students
exports.getCourseWithStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('students', '-password');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};

// Enroll in a course (student)
exports.enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.students.includes(req.user.id)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        course.students.push(req.user.id);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error enrolling in course", error: error.message });
    }
};

// Drop a course (student)
exports.dropCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.students = course.students.filter(
            studentId => studentId.toString() !== req.user.id
        );
        await course.save();
        res.json({ message: "Course dropped successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error dropping course", error: error.message });
    }
};

// Update course (admin)
exports.updateCourse = async (req, res) => {
    try {
        const { courseCode, courseName, section, semester } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { courseCode, courseName, section, semester },
            { new: true }
        );
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        res.json(course);
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating course", 
            error: error.message 
        });
    }
};

// Get course sections 
exports.getCourseSections = async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const sections = await Course.find({ 
            courseCode: courseCode 
        }).select('_id section semester students');
        
        if (sections.length === 0) {
            return res.status(404).json({ 
                message: "No sections found for this course" 
            });
        }
        res.json(sections);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching course sections", 
            error: error.message 
        });
    }
};

// Delete a course (admin)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};