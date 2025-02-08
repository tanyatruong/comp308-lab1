import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

// AddCourse component
const AddCourse = () => {
    const [courseData, setCourseData] = useState({
        courseCode: '',
        courseName: '',
        section: '',
        semester: ''
    });

    // Handle error state
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', courseData, {
                withCredentials: true
            });
            navigate('/courses');
        } catch (error) {
            setError('Error creating course');
        }
    };

    // Render AddCourse Page
    return (
        <Container className="mt-4">
            <Card className="p-4 shadow">
                <Card.Body>
                    <h2 className="text-center">Add New Course</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="courseCode"
                                value={courseData.courseCode}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="courseName"
                                value={courseData.courseName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                type="text"
                                name="section"
                                value={courseData.section}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Semester</Form.Label>
                            <Form.Control
                                type="text"
                                name="semester"
                                value={courseData.semester}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">Add Course</Button>
                            <Button variant="secondary" onClick={() => navigate('/courses')}>Cancel</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddCourse;
