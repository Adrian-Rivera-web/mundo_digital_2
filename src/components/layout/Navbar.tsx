
import { Link } from 'react-router-dom';
import { ShoppingCart, Monitor, Menu } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../hooks/useCartStore';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const itemCount = useCartStore(state => state.getItemCount());

    return (
        <nav className="bg-white shadow border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Monitor className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Mundo Digital</span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                            Catálogo
                        </Link>
                        <Link to="/admin" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Admin
                        </Link>

                        <Link to="/cart" className="relative p-2 text-gray-400 hover:text-gray-500">
                            <ShoppingCart className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Catálogo
                        </Link>
                        <Link to="/admin" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Admin
                        </Link>
                        <Link to="/cart" className="border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium">
                            Carrito ({itemCount})
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
