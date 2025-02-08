const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
require('dotenv').config();

const createAdminUser = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('password', 10);

    await Student.create({
        studentNumber: 'ADMIN001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mycentennialcollege.ca',
        password: hashedPassword,
        program: 'Administration'
    });

    console.log('Admin user created successfully');
    console.log('Admin credentials:');
    console.log('Email: admin@mycentennialcollege.ca');
    console.log('Password: password');

    await mongoose.connection.close();
    process.exit(0);
};

createAdminUser();
