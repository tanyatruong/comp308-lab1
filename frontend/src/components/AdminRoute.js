import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Frontend AdminRoute protects admin-only pages (Wrapped around routes in App.js that should only be accessible by admin)
const AdminRoute = () => {
    const { user } = useContext(AuthContext);
    return user?.email === "admin@mycentennialcollege.ca" ? 
    // If the user is not an admin, they are redirected to the dashboard.   
        <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;