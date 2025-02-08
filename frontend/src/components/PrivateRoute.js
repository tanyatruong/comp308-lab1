import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Frontend PrivateRoute protects routes that should only be accessible by authenticated users
const PrivateRoute = () => {
    const { user } = useContext(AuthContext);
    // If the user is not authenticated, they are redirected to the login page.
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;