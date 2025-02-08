import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Container, Card } from 'react-bootstrap';

const Home = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.email === "admin@mycentennialcollege.ca";

    // Render Admin Dashboard
    if (isAdmin) {
        return (
            <Container className="mt-4">
                <h2 className="text-center">Admin Dashboard</h2>
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <h5>Welcome, Administrator!</h5>
                        <p>Manage courses and students from the navigation bar.</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    // Render Student Dashboard
    return (
        <Container className="mt-4">
            <h2 className="text-center">Student Dashboard</h2>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h4>Student Information</h4>
                    <div className="mt-3">
                        <p><strong>Student Number:</strong> {user?.studentNumber}</p>
                        <p><strong>Full Name:</strong> {user?.firstName} {user?.lastName}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Program:</strong> {user?.program || 'Not specified'}</p>
                        <p><strong>Address:</strong> {user?.address || 'Not specified'}</p>
                        {user?.city && <p><strong>City:</strong> {user.city}</p>}
                    </div>
                </Card.Body>
            </Card>

            <Card className="p-4 shadow-sm mt-4">
                <Card.Body>
                    <h4>Quick Links</h4>
                    <div className="mt-3">
                        <p>👉 Go to <a href="/courses">Course Management</a> to:</p>
                        <ul>
                            <li>View your enrolled courses</li>
                            <li>Change course sections</li>
                            <li>Enroll in new courses</li>
                            <li>Drop courses</li>
                        </ul>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;