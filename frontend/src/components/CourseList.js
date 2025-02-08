import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Table, Button, Alert, Card, Modal, Form } from 'react-bootstrap';

const EditModal = React.memo(({ 
    showEditModal,
    editingCourse,
    availableSections,
    modalMode,
    isAdmin,
    handleUpdate,
    handleInputChange,
    handleClose
}) => (
    <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                {isAdmin ? 'Edit Course' : 
                 modalMode === 'change' ? 'Change Section' :
                 'Select Section to Enroll'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleUpdate}>
                {isAdmin ? (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="courseCode"
                                value={editingCourse?.courseCode || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="courseName"
                                value={editingCourse?.courseName || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                type="text"
                                name="section"
                                value={editingCourse?.section || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Semester</Form.Label>
                            <Form.Control
                                type="text"
                                name="semester"
                                value={editingCourse?.semester || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </>
                ) : (
                    <Form.Group className="mb-3">
                        <Form.Label>Available Sections for {editingCourse?.semester}</Form.Label>
                        <Form.Select
                            name="section"
                            value={editingCourse?.section || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a section</option>
                            {availableSections.map((section) => (
                                <option key={section._id} value={section.section}>
                                    Section {section.section} 
                                    ({section.students?.length || 0} students enrolled)
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {isAdmin ? 'Save Changes' : 
                         modalMode === 'change' ? 'Change Section' : 
                         'Enroll'}
                    </Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>
));
const CourseList = () => {
    // States
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext);
    const isAdmin = user?.email === "admin@mycentennialcollege.ca";
    
    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [availableSections, setAvailableSections] = useState([]);
    const [modalMode, setModalMode] = useState('');

    // Grouped available courses for student view
    const groupedAvailableCourses = useMemo(() => {
        if (!courses || !myCourses) return [];
        
        const enrolledCourseCombos = new Set(
            myCourses.map(course => `${course.courseCode}-${course.semester}`)
        );
    
        const availableCourses = courses.filter(course => 
            !enrolledCourseCombos.has(`${course.courseCode}-${course.semester}`)
        );
    
        const groupedCourses = availableCourses.reduce((acc, course) => {
            const key = `${course.courseCode}-${course.semester}`;
            if (!acc[key]) {
                const sectionsForThisCourse = availableCourses.filter(c => 
                    c.courseCode === course.courseCode && 
                    c.semester === course.semester
                );
                
                const sections = sectionsForThisCourse.map(c => c.section);
                acc[key] = {
                    ...course,
                    allSections: sections.join(', ')
                };
            }
            return acc;
        }, {});
    
        return Object.values(groupedCourses);
    }, [courses, myCourses]);

    // Memoized handlers
    const handleClose = useCallback(() => {
        setShowEditModal(false);
        setEditingCourse(null);
        setAvailableSections([]);
        setModalMode('');
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditingCourse(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Admin - Fetch all courses
    const fetchAllCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses', { 
                withCredentials: true 
            });
            setCourses(res.data);
        } catch (err) {
            setError('Error fetching courses');
        }
    };

    // Student - Fetch all courses enrolled by the student
    const fetchMyCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses/my-courses', { 
                withCredentials: true 
            });
            setMyCourses(res.data);
        } catch (err) {
            setError('Error fetching your courses');
        }
    };

    // Student - Fetch all available courses
    const fetchAvailableCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/courses', { 
                withCredentials: true 
            });
            setCourses(res.data);
        } catch (err) {
            setError('Error fetching available courses');
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchAllCourses();
        } else {
            fetchMyCourses();
            fetchAvailableCourses();
        }
    }, [isAdmin]);

    // Admin - Delete course
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`http://localhost:5000/api/courses/${id}`, { 
                    withCredentials: true 
                });
                setCourses(courses.filter(course => course._id !== id));
                setSuccess('Course deleted successfully');
            } catch (err) {
                setError('Error deleting course');
            }
        }
    };

    // Student - Drop course
    const handleDrop = async (courseId) => {
        if (window.confirm('Are you sure you want to drop this course?')) {
            try {
                await axios.put(`http://localhost:5000/api/courses/${courseId}/drop`, {}, { 
                    withCredentials: true 
                });
                setSuccess('Successfully dropped course');
                fetchMyCourses();
                fetchAvailableCourses();
            } catch (err) {
                setError('Error dropping course');
            }
        }
    };

    // Student - Edit section or enroll in course
    const handleEditClick = async (course, mode = 'edit') => {
        setModalMode(mode);
        if (!isAdmin) {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/courses/sections/${course.courseCode}`,
                    { withCredentials: true }
                );
                const availableSecs = mode === 'enroll' 
                    ? response.data.filter(section => section.semester === course.semester)
                    : response.data.filter(section => 
                        section.section !== course.section && 
                        section.semester === course.semester
                    );
                
                setAvailableSections(availableSecs);
                setEditingCourse({
                    ...course,
                    section: ''
                });
            } catch (err) {
                setError('Error fetching course sections');
                return;
            }
        } else {
            setEditingCourse({ ...course });
        }
        setShowEditModal(true);
    };

    // Admin - Edit course
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isAdmin) {
                await axios.put(
                    `http://localhost:5000/api/courses/${editingCourse._id}`,
                    editingCourse,
                    { withCredentials: true }
                );
                setSuccess('Course updated successfully');
            } else {
                const targetCourse = availableSections.find(
                    section => section.section === editingCourse.section
                );
                
                if (!targetCourse) {
                    setError('Selected section not found');
                    return;
                }

                if (modalMode === 'change') {
                    await axios.put(
                        `http://localhost:5000/api/courses/${editingCourse._id}/drop`,
                        {},
                        { withCredentials: true }
                    );
                }
                
                await axios.put(
                    `http://localhost:5000/api/courses/${targetCourse._id}/enroll`,
                    {},
                    { withCredentials: true }
                );

                setSuccess(modalMode === 'change' 
                    ? 'Successfully changed section' 
                    : 'Successfully enrolled in course'
                );
            }
            
            setShowEditModal(false);
            if (isAdmin) {
                fetchAllCourses();
            } else {
                fetchMyCourses();
                fetchAvailableCourses();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating course');
        }
    };
    // Admin view
    if (isAdmin) {
        return (
            <Container className="mt-4">
                <h2 className="text-center">Course Management</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-3">
                            <h4>All Courses</h4>
                            <Link to="/courses/add">
                                <Button variant="primary">Add New Course</Button>
                            </Link>
                        </div>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Section</th>
                                    <th>Semester</th>
                                    <th>Enrolled Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id}>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseName}</td>
                                        <td>{course.section}</td>
                                        <td>{course.semester}</td>
                                        <td>{course.students?.length || 0}</td>
                                        <td>
                                            <Link to={`/courses/${course._id}/students`}>
                                                <Button variant="info" size="sm" className="me-2">
                                                    View
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEditClick(course)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(course._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                <EditModal 
                    showEditModal={showEditModal}
                    editingCourse={editingCourse}
                    availableSections={availableSections}
                    modalMode={modalMode}
                    isAdmin={isAdmin}
                    handleUpdate={handleUpdate}
                    handleInputChange={handleInputChange}
                    handleClose={handleClose}
                />
            </Container>
        );
    }

    // Student view
    return (
        <Container className="mt-4">
            <h2 className="text-center">Course Management</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="p-4 shadow-sm mb-4">
                <Card.Body>
                    <h4>My Enrolled Courses</h4>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Section</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myCourses.map(course => (
                                <tr key={course._id}>
                                    <td>{course.courseCode}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.section}</td>
                                    <td>{course.semester}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditClick(course, 'change')}
                                        >
                                            Change Section
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDrop(course._id)}
                                        >
                                            Drop
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h4>Available Courses</h4>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Available Sections</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedAvailableCourses.map(course => (
                                <tr key={`${course.courseCode}-${course.semester}`}>
                                    <td>{course.courseCode}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.allSections}</td>
                                    <td>{course.semester}</td>
                                    <td>
                                        <Button 
                                            variant="success" 
                                            size="sm" 
                                            onClick={() => handleEditClick(course, 'enroll')}
                                        >
                                            Enroll
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <EditModal 
                showEditModal={showEditModal}
                editingCourse={editingCourse}
                availableSections={availableSections}
                modalMode={modalMode}
                isAdmin={isAdmin}
                handleUpdate={handleUpdate}
                handleInputChange={handleInputChange}
                handleClose={handleClose}
            />
        </Container>
    );
};

export default CourseList;