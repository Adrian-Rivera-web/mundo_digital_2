import { Link } from 'react-router-dom';
import bannerImage from '../../assets/banner.png';
import { ArrowRight, Star, Truck, Shield } from 'lucide-react';

export const HomePage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 border-b border-gray-800">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-50"
                        src={bannerImage}
                        alt="Tecnología Banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Tecnología al alcance <br className="hidden sm:block" />
                        <span className="text-blue-500">de tu mano</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        Descubre lo último en gadgets, computación y accesorios. Calidad garantizada y envíos a todo Chile.
                    </p>
                    <div className="mt-10 max-w-sm sm:flex sm:max-w-none">
                        <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                            <Link
                                to="/products"
                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50 sm:px-8"
                            >
                                Ver Catálogo
                            </Link>
                            <Link
                                to="/about"
                                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                            >
                                Saber más
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Envío Rápido</h3>
                                <p className="text-sm text-gray-500">A todo el país en 24-48hrs</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Garantía Extendida</h3>
                                <p className="text-sm text-gray-500">12 meses en todos los productos</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Star className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Calidad Premium</h3>
                                <p className="text-sm text-gray-500">Marcas líderes certificadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Categories Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Lo Más Nuevo</h2>
                    <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                        Ver todo el catálogo <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                {/* Simple category grid teaser */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/products" className="group relative h-64 rounded-lg overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000" alt="Laptops" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="text-white font-bold text-xl">Laptops</span>
                        </div>
                    </Link>
                    <Link to="/products" className="group relative h-64 rounded-lg overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000" alt="Celulares" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="text-white font-bold text-xl">Celulares</span>
                        </div>
                    </Link>
                    <Link to="/products" className="group relative h-64 rounded-lg overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000" alt="Audio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="text-white font-bold text-xl">Audio & Accesorios</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
