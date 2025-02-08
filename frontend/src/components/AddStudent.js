import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';

// AddStudent component
const AddStudent = () => {
    const [formData, setFormData] = useState({
        studentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        phoneNumber: '',
        program: '',
        favoriteTopic: '',
        strongestSkill: ''
    });

    // Handle error state
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Programs list for dropdown
    const programs = [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Cybersecurity",
        "Artificial Intelligence",
        "Business Administration",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Marketing"
    ];

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/students', formData, { withCredentials: true });
            alert('Student added successfully');
            navigate('/students');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding student');
        }
    };

    // Render AddStudent Page
    return (
        <Container className="mt-4">
            <Card className="p-4 shadow">
                <Card.Body>
                    <h2 className="text-center">Add New Student</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        
                        {/* Email & Password */}
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Student Number, First Name, Last Name */}
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Student Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="studentNumber"
                                        value={formData.studentNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Address, City, Phone */}
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Program (Dropdown), Favorite Topic, Strongest Skill */}
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Program</Form.Label>
                                    <Form.Select 
                                        name="program" 
                                        value={formData.program} 
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a program</option>
                                        {programs.map((program, index) => (
                                            <option key={index} value={program}>{program}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Favorite Topic</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="favoriteTopic"
                                        value={formData.favoriteTopic}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Strongest Skill</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="strongestSkill"
                                        value={formData.strongestSkill}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Buttons */}
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">Add Student</Button>
                            <Button variant="secondary" onClick={() => navigate('/students')}>Cancel</Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddStudent;
