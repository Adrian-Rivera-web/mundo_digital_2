import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/ui/ProductCard';
import { Filter, Tag, X } from 'lucide-react';

export const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filtros locales state
    const categoryParam = searchParams.get('category');
    const offersParam = searchParams.get('offers') === 'true';

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'Todas');
    const [showOffersOnly, setShowOffersOnly] = useState<boolean>(offersParam);

    useEffect(() => {
        // Sincronizar URL si cambia el estado local (opcional, pero buena UX)
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'Todas') params.set('category', selectedCategory);
        if (showOffersOnly) params.set('offers', 'true');
        setSearchParams(params, { replace: true });
    }, [selectedCategory, showOffersOnly, setSearchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductService.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Extraer categorías únicas
    const categories = useMemo(() => {
        const cats = products.map(p => p.category);
        return ['Todas', ...new Set(cats)];
    }, [products]);

    // Filtrar productos
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
            const matchesOffers = !showOffersOnly || (!!product.discountPrice && product.discountPrice < product.price);
            return matchesCategory && matchesOffers;
        });
    }, [products, selectedCategory, showOffersOnly]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar de Filtros */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center mb-6">
                            <Filter className="h-5 w-5 text-gray-400 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                        </div>

                        {/* Filtro Categoría */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                                Categorías
                            </h3>
                            <ul className="space-y-2">
                                {categories.map(category => (
                                    <li key={category}>
                                        <button
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === category
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Filtro Ofertas */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                                Promociones
                            </h3>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showOffersOnly}
                                        onChange={() => setShowOffersOnly(!showOffersOnly)}
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${showOffersOnly ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${showOffersOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={`text-sm ${showOffersOnly ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    Solo Ofertas
                                </span>
                            </label>
                        </div>

                        {(selectedCategory !== 'Todas' || showOffersOnly) && (
                            <button
                                onClick={() => {
                                    setSelectedCategory('Todas');
                                    setShowOffersOnly(false);
                                }}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </aside>

                {/* Grid de Productos */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {selectedCategory === 'Todas' ? 'Catálogo Completo' : selectedCategory}
                        </h1>
                        <span className="text-gray-500 text-sm">
                            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {showOffersOnly && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Tag className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Viendo solo productos en oferta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Filter className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Intenta cambiar los filtros seleccionados.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Todas');
                                        setShowOffersOnly(false);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
