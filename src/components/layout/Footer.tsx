import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Mundo Digital */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Mundo Digital</h3>
                        <p className="text-gray-400">
                            Tu tienda experta en tecnología. Encuentra las mejores marcas al mejor precio.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Ayuda al Cliente */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Ayuda al Cliente</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">¿Quiénes Somos?</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Misión y Visión</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">¿Por qué Elegirnos?</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Marcas Distribuidoras</Link></li>
                        </ul>
                    </div>

                    {/* Contáctanos */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Contáctanos</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-400">Calle Nueva 1660, Huechuraba, Santiago</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-gray-400">+56 9 3677 8106</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-blue-500 mr-2" />
                                <span className="text-gray-400">soporte@mundodigital.cl</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; 2026 Mundo Digital - Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <div className="flex items-center text-gray-500">
                            <CreditCard className="h-6 w-6 mr-1" />
                            <span className="text-xs">VISA</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <CreditCard className="h-6 w-6 mr-1" />
                            <span className="text-xs">Mastercard</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                            <CreditCard className="h-6 w-6 mr-1" />
                            <span className="text-xs">PayPal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
