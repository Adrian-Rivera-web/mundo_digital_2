
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User as UserIcon, LogOut, ChevronDown, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../../hooks/useCartStore';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.jpg';
import { NAV_LINKS } from '../../data';

export const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const itemCount = useCartStore(state => state.getItemCount());
    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
        navigate('/');
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-[#1f69a2] dark:bg-gray-900 shadow border-b border-blue-800 dark:border-gray-800 transition-colors duration-200">
            {/* Main Header Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Mundo Digital Logo" className="h-10 w-auto rounded-sm" />
                            <span className="text-2xl font-bold text-white">Mundo Digital</span>
                        </Link>
                    </div>

                    {/* Search Bar - Hidden on mobile, visible on sm+ */}
                    <div className="hidden sm:flex flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:border-white focus:ring-0 sm:text-sm transition-colors duration-200"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-6 w-6" />
                            ) : (
                                <Moon className="h-6 w-6" />
                            )}
                        </button>
                        {!isAuthenticated ? (
                            <Link to="/login" className="text-blue-100 hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10">
                                Iniciar Sesión
                            </Link>
                        ) : (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 text-blue-100 hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-white/10"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center border border-blue-400">
                                        <UserIcon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="max-w-[100px] truncate">{user?.name}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                        <div className="py-1">
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <LayoutDashboard className="h-4 w-4 mr-2 text-blue-600" />
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                Mi Perfil
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Link to="/cart" className="relative p-2 text-blue-100 hover:text-white transition-colors rounded-full hover:bg-white/10">
                            <ShoppingCart className="h-7 w-7" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <Link to="/cart" className="relative p-2 text-blue-100 hover:text-white mr-2">
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-500 bg-white rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700/50 focus:outline-none transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation Row - Hidden on mobile */}
            <div className="hidden sm:block border-t border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 h-12 items-center text-sm font-medium">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-900 hover:text-blue-600"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden border-t border-gray-200 bg-white">
                    <div className="pt-4 pb-4 px-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {isAuthenticated && (
                            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                        )}

                        <div className="relative w-full mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-gray-900"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                {isAuthenticated ? (
                                    <>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                            >
                                                <LayoutDashboard className="h-5 w-5 mr-3" />
                                                Panel Admin
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                                            Mi Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-5 w-5 mr-3" />
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                    >
                                        <UserIcon className="h-5 w-5 mr-3" />
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
