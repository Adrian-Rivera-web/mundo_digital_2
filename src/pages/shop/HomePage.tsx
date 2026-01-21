import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import bannerImage from '../../assets/banner.png';
import { BrandCarousel } from '../../components/shop/BrandCarousel';

export const HomePage = () => {
    const [bestSellers, setBestSellers] = useState<any[]>([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            // Import dynamically to avoid circular dependencies if any, or just standard import
            const { ProductService } = await import('../../services/product.service');
            const data = await ProductService.getBestSellers(4);
            setBestSellers(data);
        };
        fetchBestSellers();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    return (
        <div className="bg-white">
            {/* Banner */}
            <section className="relative w-full">
                <img
                    className="w-full object-cover h-[400px] md:h-[500px]"
                    src={bannerImage}
                    alt="Banner de tienda"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Mundo Digital</h1>
                        <p className="text-xl text-white mb-8">Tu tienda experta en tecnología</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categorias Populares */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Categorías Populares</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {['Laptops', 'Celulares', 'Periféricos', 'Componentes'].map((cat) => (
                        <Link to={`/products?category=${cat}`} key={cat} className="group relative rounded-lg overflow-hidden h-40 shadow-md">
                            <div className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center">
                                <span className="text-white text-xl font-bold uppercase tracking-wider">{cat}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mas Vendidos */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Más Vendidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {bestSellers.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                                <p className="text-blue-600 font-bold">{formatPrice(product.price)}</p>
                                <Link to={`/product/${product.id}`} className="mt-4 block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Ver Detalle
                                </Link>
                            </div>
                        </div>
                    ))}
                    {bestSellers.length === 0 && (
                        <div className="col-span-4 text-center text-gray-500 py-8">
                            Cargando productos destacados...
                        </div>
                    )}
                </div>

                {/* Ofertas Destacadas */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Ofertas Destacadas</h2>
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-12 flex flex-col justify-center">
                            <span className="text-blue-400 font-bold tracking-wider uppercase mb-2">Oferta Relámpago</span>
                            <h3 className="text-4xl font-bold text-white mb-4">Pack Gamer Pro</h3>
                            <p className="text-gray-300 mb-8">Lleva tu experiencia de juego al siguiente nivel con nuestro kit completo de periféricos de alta gama.</p>
                            <Link to="/products" className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors w-fit">
                                Comprar Ahora
                            </Link>
                        </div>
                        <div className="h-64 md:h-auto bg-gray-800 flex items-center justify-center">
                            {/* Placeholder for offer image */}
                            <div className="text-gray-600 font-bold text-2xl">Imagen Oferta</div>
                        </div>
                    </div>
                </div>

                {/* Las Mejores Marcas */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Las Mejores Marcas</h2>
                <div className="mb-16">
                    <BrandCarousel />
                </div>
            </div>
        </div>
    );
};
