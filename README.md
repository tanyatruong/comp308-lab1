# comp308-lab1
Create a comprehensive student/course system using the MERN stack. Develop an Express REST API to expose CRUD functionalities for managing student and course information. Implement a React front-end to allow students to interact with the system and an admin user to manage student records.
Student Course Management System
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing student enrollment and course registration.

# Features

# Admin Functions
- Create and manage student accounts
- Create and manage courses
- View enrolled students for each course
- Edit course details
- Delete courses

# Student Functions
- View available courses
- Enroll in courses
- Drop courses
- Change course sections
- View personal dashboard with enrollment information

# Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm (Node Package Manager)

# Installation & Setup
1. Database Setup

Ensure MongoDB is running locally at localhost:27017

2. Backend Setup
# Navigate to backend directory
cd backend
# Install dependencies
npm install
# Create admin account (important!)
npm run setup-admin
# Start backend server in development mode
npm run dev

3. Frontend Setup
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend application
npm start

# Default Credentials
# Admin Account
- Email: admin@mycentennialcollege.ca
- Password: (set during setup-admin script)

# Student Accounts
- Created by admin through the application
- Students can login using their email and password set by admin

# Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

# Important Notes
- Make sure MongoDB is running before starting the application
- The admin account must be created using the setup script before using the application
- Run the backend and frontend in separate terminal windows
- The backend must be running for the frontend to function properly

# Tech Stack
- Frontend: React.js, React Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
