import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Mundo Digital */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Mundo Digital</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Tu tienda experta en tecnología. Encuentra las mejores marcas al mejor precio con el respaldo que mereces.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-300">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Ayuda al Cliente */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white tracking-wider uppercase">Ayuda al Cliente</h3>
                        <ul className="space-y-3">
                            {['¿Quiénes Somos?', 'Misión y Visión', '¿Por qué Elegirnos?', 'Marcas Distribuidoras'].map((item) => (
                                <li key={item}>
                                    <Link to="/about" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-2 transition-all duration-300 h-0.5 bg-accent-400 mr-0 group-hover:mr-2"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contáctanos */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white tracking-wider uppercase">Contáctanos</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary-900/50 transition-colors mr-4">
                                    <MapPin className="h-6 w-6 text-primary-500" />
                                </div>
                                <span className="text-gray-400">Calle Nueva 1660, Huechuraba, Santiago</span>
                            </li>
                            <li className="flex items-center group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary-900/50 transition-colors mr-4">
                                    <Phone className="h-5 w-5 text-primary-500" />
                                </div>
                                <span className="text-gray-400">+56 9 3677 8106</span>
                            </li>
                            <li className="flex items-center group">
                                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-primary-900/50 transition-colors mr-4">
                                    <Mail className="h-5 w-5 text-primary-500" />
                                </div>
                                <span className="text-gray-400">soporte@mundodigital.cl</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; 2026 Mundo Digital - Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-4 mt-6 md:mt-0 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center text-gray-400 bg-gray-800 px-3 py-1 rounded">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span className="text-xs font-bold">VISA</span>
                        </div>
                        <div className="flex items-center text-gray-400 bg-gray-800 px-3 py-1 rounded">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span className="text-xs font-bold">Mastercard</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
