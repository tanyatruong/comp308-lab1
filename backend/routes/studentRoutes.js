const express = require('express');
const { loginStudent } = require('../controllers/studentController');

const router = express.Router();

router.post('/login', loginStudent);

module.exports = router;
