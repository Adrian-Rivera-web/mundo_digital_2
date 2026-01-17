
import { Link } from 'react-router-dom';
import { ShoppingCart, Monitor, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../hooks/useCartStore';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const itemCount = useCartStore(state => state.getItemCount());
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <nav className="bg-white shadow border-b border-gray-200">
            {/* Main Header Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            <Monitor className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-900">Mundo Digital</span>
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
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-6">
                        <Link to="/admin" className="text-gray-500 hover:text-gray-900 font-medium">
                            Admin
                        </Link>

                        <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium">
                            Login
                        </Link>

                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-blue-600">
                            <ShoppingCart className="h-7 w-7" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-blue-600 mr-4">
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
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
                        <Link to="/" className="text-gray-900 hover:text-blue-600">
                            Productos
                        </Link>
                        <Link to="/about" className="text-gray-500 hover:text-gray-900">
                            Nosotros
                        </Link>
                        <Link to="/contact" className="text-gray-500 hover:text-gray-900">
                            Contacto
                        </Link>
                        <Link to="/reviews" className="text-gray-500 hover:text-gray-900">
                            Reseñas
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden border-t border-gray-200">
                    <div className="pt-4 pb-4 px-4">
                        <div className="relative w-full mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Productos
                        </Link>
                        <Link to="/about" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Nosotros
                        </Link>
                        <Link to="/contact" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Contacto
                        </Link>
                        <Link to="/reviews" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Reseñas
                        </Link>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link to="/admin" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Admin Dashboard
                        </Link>
                        <Link to="/login" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
