import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import AddCourse from './components/AddCourse';
import AddStudent from './components/AddStudent';
import CourseList from './components/CourseList';
import CourseStudents from './components/CourseStudents';
import StudentList from './components/StudentList';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Component to handle the layout with conditional Navbar
const AppLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    return (
        <div>
            {!isLoginPage && <Navbar />}
            <div className="container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/courses" element={<CourseList />} />
                        
                        {/* Admin Only Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/students" element={<StudentList />} />
                            <Route path="/students/add" element={<AddStudent />} />
                            <Route path="/courses/add" element={<AddCourse />} />
                            <Route path="/courses/:courseId/students" element={<CourseStudents />} />
                        </Route>
                    </Route>

                    {/* Catch all redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
};

export default App;