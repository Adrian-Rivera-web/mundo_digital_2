import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminGuard = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    // Check if user exists and has admin role
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        // Redirect to login, but save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
