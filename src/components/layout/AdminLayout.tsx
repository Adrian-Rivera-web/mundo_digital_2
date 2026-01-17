import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Monitor, LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Pedidos', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Productos', href: '/admin/products', icon: Package },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 bg-gray-900">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <Monitor className="h-8 w-8 text-blue-500" />
                                <span className="ml-2 text-xl font-bold text-white">MD Admin</span>
                            </div>
                            <nav className="mt-8 flex-1 px-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href ||
                                        (item.href !== '/admin' && location.pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                        >
                                            <item.icon className={`${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-300'
                                                } mr-3 flex-shrink-0 h-6 w-6`} aria-hidden="true" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex bg-gray-800 p-4">
                            <div className="flex-shrink-0 w-full group block">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{user?.name}</p>
                                        <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                                            {user?.role}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-auto text-gray-400 hover:text-white"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
