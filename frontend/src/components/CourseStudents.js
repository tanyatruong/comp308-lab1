import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Table, Button, Card, Alert, Spinner } from 'react-bootstrap';

// Admin View of Students Enrolled in a Course
const CourseStudents = () => {
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const { courseId } = useParams();

    useEffect(() => {
        const fetchCourseAndStudents = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
                    withCredentials: true
                });
                setCourse(res.data);
                setStudents(res.data.students || []);
            } catch (err) {
                setError('Error fetching course details');
                console.error('Error:', err);
            }
        };

        fetchCourseAndStudents();
    }, [courseId]);

    if (!course) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // Render CourseStudents Page (Number of students enrolled in a course) 
    return (
        <Container className="mt-4">
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center">Students Enrolled in {course.courseCode} - {course.courseName}</h2>
                    <p><strong>Section:</strong> {course.section}</p>
                    <p><strong>Semester:</strong> {course.semester}</p>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            <div className="mt-3 d-flex justify-content-between">
                <h4>Enrolled Students ({students.length})</h4>
                <Link to="/courses">
                    <Button variant="secondary">Back to Courses</Button>
                </Link>
            </div>

            {students.length === 0 ? (
                <Alert variant="warning" className="mt-3">No students enrolled in this course.</Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Program</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id}>
                                <td>{student.studentNumber}</td>
                                <td>{`${student.firstName} ${student.lastName}`}</td>
                                <td>{student.email}</td>
                                <td>{student.program}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default CourseStudents;
