const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: String,
    city: String,
    phoneNumber: String,
    email: { type: String, required: true, unique: true },
    program: String,
    favoriteTopic: String,
    strongestSkill: String
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
