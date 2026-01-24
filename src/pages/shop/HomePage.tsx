import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BrandCarousel } from '../../components/shop/BrandCarousel';
import { ProductCarousel } from '../../components/shop/ProductCarousel';
import { HeroCarousel } from '../../components/shop/HeroCarousel';

export const HomePage = () => {
    const [bestSellers, setBestSellers] = useState<any[]>([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            // Import dynamically to avoid circular dependencies if any, or just standard import
            const { ProductService } = await import('../../services/product.service');
            const data = await ProductService.getBestSellers(8);
            setBestSellers(data);
        };
        fetchBestSellers();
    }, []);



    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Banner Carousel */}
            <HeroCarousel />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">

                {/* Categorias Populares */}
                <div className="mb-20">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 text-center mb-10">
                        Explora por Categoría
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Laptops', color: 'from-blue-500 to-primary-600' },
                            { name: 'Celulares', color: 'from-secondary-500 to-purple-600' },
                            { name: 'Periféricos', color: 'from-accent-400 to-teal-500' },
                            { name: 'Componentes', color: 'from-orange-400 to-red-500' }
                        ].map((cat) => (
                            <Link to={`/products?category=${cat.name}`} key={cat.name} className="group relative rounded-2xl overflow-hidden h-44 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6`}>
                                    <span className="text-white text-2xl font-bold tracking-tight mb-2 drop-shadow-md">{cat.name}</span>
                                    <span className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">Ver Productos</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Mas Vendidos */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Lo Más Vendido</h2>
                        <Link to="/products" className="text-primary-600 font-semibold hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center transition-colors">
                            Ver todo <span className="ml-2 text-xl">→</span>
                        </Link>
                    </div>
                    {bestSellers.length > 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl">
                            <ProductCarousel products={bestSellers} />
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <div className="animate-pulse flex space-x-4 justify-center">
                                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                <div className="flex-1 space-y-6 py-1 max-w-xs">
                                    <div className="h-2 bg-gray-200 rounded"></div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                                            <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ofertas Destacadas */}
                <div className="mb-20">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-black/80 z-10"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>

                        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-16">
                            <div className="flex flex-col justify-center text-left">
                                <div className="inline-block px-4 py-1 bg-accent-500 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-6 w-fit shadow-lg shadow-accent-500/30">
                                    Oferta Limitada
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight text-center md:text-left">
                                    Setup Gamer <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-secondary-400">Ultimate Pro</span>
                                </h3>
                                <p className="text-gray-300 text-lg mb-8 max-w-md text-center md:text-left mx-auto md:mx-0">
                                    Potencia tu juego con la mejor tecnología. Teclados mecánicos, ratones de precisión y monitores de alta tasa de refresco.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link to="/products" className="px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                                        Comprar Ahora
                                    </Link>
                                    <Link to="/products?category=Periféricos" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm text-center">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                            {/* Decorative element could go here */}
                        </div>
                    </div>
                </div>

                {/* Las Mejores Marcas */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-400 text-center mb-8 uppercase tracking-widest">Nuestras Marcas</h2>
                    <div className="grayscale hover:grayscale-0 transition-all duration-500">
                        <BrandCarousel />
                    </div>
                </div>
            </div>
        </div>
    );
};
