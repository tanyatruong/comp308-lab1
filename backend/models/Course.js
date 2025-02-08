const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    section: { type: String },
    semester: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });
module.exports = mongoose.model('Course', CourseSchema);