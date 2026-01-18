import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Monitor } from 'lucide-react';

export const AdminGuard = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    // Check if user exists and has admin role
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                        <Monitor className="h-10 w-10 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-gray-900 uppercase">Acceso Restringido</h1>
                        <p className="text-gray-500 font-medium">
                            Tu cuenta (<span className="font-bold text-gray-700">{user.email}</span>) no tiene permisos de administrador para acceder a esta sección.
                        </p>
                    </div>
                    <div className="pt-4 space-y-3">
                        <Link
                            to="/"
                            className="block w-full py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                        >
                            Volver a la Tienda
                        </Link>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="block w-full py-3 border border-gray-200 text-gray-500 font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 italic">
                        Si crees que esto es un error, contacta al soporte técnico.
                    </p>
                </div>
            </div>
        );
    }

    return <Outlet />;
};
