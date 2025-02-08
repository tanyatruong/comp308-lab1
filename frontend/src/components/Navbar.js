import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

// NavigationBar
const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAdmin = user?.email === "admin@mycentennialcollege.ca";

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // If user is not authenticated, return null (no navigation bar for login page)
    if (!user) return null;

    // Render NavigationBar
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAdmin ? (
                            // Navigation Bar for Admin
                            <>
                                <Nav.Link as={Link} to="/students">Students</Nav.Link>
                                <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                                <Nav.Link as={Link} to="/students/add">Add Student</Nav.Link>
                                <Nav.Link as={Link} to="/courses/add">Add Course</Nav.Link>
                            </>
                        ) : (
                            // Navigation Bar for Student
                            <Nav.Link as={Link} to="/courses">My Courses</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        <Navbar.Text className="me-3">
                            Welcome, {isAdmin ? 'Admin' : user.firstName}
                        </Navbar.Text>
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
