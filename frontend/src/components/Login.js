import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import centennialLogo from '../logo.png'; // Adjust the path as needed

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Check for active session when component mounts
    useEffect(() => {
        if (user) {
            // If user is already logged in, redirect to dashboard
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const success = await login(email, password);
            if (success) {
                navigate(email === "admin@mycentennialcollege.ca" ? '/admin' : '/dashboard');
            } else {
                setError('Invalid credentials. Please check with your administrator.');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please check with your administrator.');
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            {/* Logo and Course Title */}
            <div className="text-center mb-4">
                <img 
                    src={centennialLogo} 
                    alt="Centennial College Logo" 
                    className="img-fluid mb-3" 
                    style={{ maxHeight: '120px' }}
                />
            </div>

            {/* Login Card */}
            <Card className="p-4 shadow-lg" style={{ width: '400px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Login</h3>

                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>

                    <p className="text-muted text-center mt-3">
                        * Students: Please contact your administrator for login credentials.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;