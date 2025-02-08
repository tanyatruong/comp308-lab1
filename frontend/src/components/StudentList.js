import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Card, Alert, Spinner } from 'react-bootstrap';

// Admin - Student List
const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/students', {
                withCredentials: true
            });
            setStudents(res.data);
        } catch (err) {
            setError('Error fetching students');
            console.error('Error:', err);
        }
    };

    // Render Student List
    return (
        <Container className="mt-4">
            <h2 className="text-center">Student Management</h2>
                        
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    {/* Header Section with Title and Add Student Button */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>All Students</h4>
                        <Link to="/students/add">
                            <Button variant="primary">Add New Student</Button>
                        </Link>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Student Table */}
                    {students.length === 0 ? (
                        <Container className="d-flex justify-content-center align-items-center vh-50">
                            <Spinner animation="border" variant="primary" />
                        </Container>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Student No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Program</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.studentNumber}</td>
                                        <td>{`${student.firstName} ${student.lastName}`}</td>
                                        <td>{student.email}</td>
                                        <td>{student.program}</td>
                                        <td>{student.phoneNumber}</td>
                                        <td>{student.address}</td>
                                        <td>{student.city}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
        </Container>
    );
};

export default StudentList;
