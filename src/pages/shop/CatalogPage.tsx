import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../components/ui/ProductCard';
import { Filter, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [salesMap, setSalesMap] = useState<Record<string, number>>({});

    // --- Local State for Filters ---
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const offersParam = searchParams.get('offers') === 'true';
    const searchParam = searchParams.get('search') || '';

    // Initialize categories from comma-separated string if present
    const initialCategories = categoryParam ? categoryParam.split(',') : [];

    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [showOffersOnly, setShowOffersOnly] = useState<boolean>(offersParam);
    const [searchQuery, setSearchQuery] = useState<string>(searchParam);
    const [sortBy, setSortBy] = useState<string>('recommended');

    // UI State
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isBrandsOpen, setIsBrandsOpen] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Brand Filter State
    const initialBrands = brandParam ? brandParam.split(',') : [];
    const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // --- Effect: Sync URL ---
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
        if (selectedBrands.length > 0) params.set('brand', selectedBrands.join(','));
        if (showOffersOnly) params.set('offers', 'true');
        if (searchQuery) params.set('search', searchQuery);
        setSearchParams(params, { replace: true });
    }, [selectedCategories, selectedBrands, showOffersOnly, searchQuery, setSearchParams]);

    // --- Effect: Load Data ---
    useEffect(() => {
        const fetchProductsAndSales = async () => {
            try {
                const [productsData, salesData] = await Promise.all([
                    ProductService.getAll(),
                    ProductService.getProductSalesMap()
                ]);
                setProducts(productsData);
                setSalesMap(salesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndSales();
    }, []);

    // --- Scroll to top on page change ---
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // --- Reset Page on Filter Change ---
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, showOffersOnly, searchQuery, selectedBrands]);


    // --- Derived Data: Unique Categories & Brands ---
    const categories = useMemo(() => {
        const cats = products.map(p => p.category);
        return ['Todas', ...new Set(cats)];
    }, [products]);

    const brands = useMemo(() => {
        // Assuming product has a 'brand' property. If not, we might need to rely on 'manufacturer' or similar if it existed.
        // Based on previous context, user asked to scan 'marcas'. 
        // If the Product type strictly doesn't have brand, we might need to infer it or update type.
        // For now, I'll assume 'brand' exists on Product interface based on requirements.
        // If TS error occurs, I will fix.
        const allBrands = products.map(p => (p as any).brand || 'Genérico').filter(b => b !== 'Genérico');
        return [...new Set(allBrands)].sort();
    }, [products]);

    // Top 3 IDs para etiqueta popular
    const popularProductIds = useMemo(() => {
        return Object.entries(salesMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([id]) => id);
    }, [salesMap]);

    // --- Filter & Sort Logic ---
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesOffers = !showOffersOnly || (!!product.discountPrice && product.discountPrice < product.price);
            const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());

            // Brand Check
            const productBrand = (product as any).brand || 'Genérico';
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);

            return matchesCategory && matchesOffers && matchesSearch && matchesBrand;
        });

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => {
                    const priceA = a.discountPrice || a.price;
                    const priceB = b.discountPrice || b.price;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                result.sort((a, b) => {
                    const priceA = a.discountPrice || a.price;
                    const priceB = b.discountPrice || b.price;
                    return priceB - priceA;
                });
                break;
            case 'bestsellers':
                result.sort((a, b) => {
                    const salesA = salesMap[a.id] || 0;
                    const salesB = salesMap[b.id] || 0;
                    return salesB - salesA;
                });
                break;
            case 'recommended':
            default:
                break;
        }

        return result;
    }, [products, selectedCategories, showOffersOnly, selectedBrands, searchQuery, sortBy, salesMap]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handler for category checkbox
    const toggleCategory = (category: string) => {
        if (category === 'Todas') {
            setSelectedCategories([]);
            return;
        }
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    // Handler for brand checkbox
    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

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
                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Filter className="h-5 w-5 mr-2" />
                        {isMobileFiltersOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </button>
                </div>

                <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                        <div className="flex items-center mb-6">
                            <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h2>
                        </div>

                        {/* Filtro Categoría */}
                        <div className="mb-8 border-b border-gray-100 pb-6">
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3 focus:outline-none"
                            >
                                <span>Categorías</span>
                                {isCategoriesOpen ? <ChevronRight className="h-4 w-4 transform rotate-90 transition-transform" /> : <ChevronRight className="h-4 w-4 transition-transform" />}
                            </button>

                            {isCategoriesOpen && (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {categories.filter(c => c !== 'Todas').map(category => (
                                        <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                />
                                            </div>
                                            <span className={`text-sm ${selectedCategories.includes(category) ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filtro Marcas */}
                        <div className="mb-8 border-b border-gray-100 pb-6">
                            <button
                                onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3 focus:outline-none"
                            >
                                <span>Marcas</span>
                                {isBrandsOpen ? <ChevronRight className="h-4 w-4 transform rotate-90 transition-transform" /> : <ChevronRight className="h-4 w-4 transition-transform" />}
                            </button>

                            {isBrandsOpen && (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map(brand => (
                                        <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggleBrand(brand)}
                                                />
                                            </div>
                                            <span className={`text-sm ${selectedBrands.includes(brand) ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                    {brands.length === 0 && (
                                        <p className="text-xs text-gray-400 italic">No hay marcas disponibles</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Filtro Ofertas */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
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
                                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${showOffersOnly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${showOffersOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={`text-sm ${showOffersOnly ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                    Solo Ofertas
                                </span>
                            </label>
                        </div>

                        {(selectedCategories.length > 0 || showOffersOnly || searchQuery || selectedBrands.length > 0) && (
                            <button
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setShowOffersOnly(false);
                                    setSearchQuery('');
                                    setSelectedBrands([]);
                                }}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </aside>

                {/* Grid de Productos */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {selectedCategories.length === 1 ? selectedCategories[0] : (selectedCategories.length > 1 ? 'Múltiples Categorías' : 'Catálogo Completo')}
                            </h1>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Ordenar por:</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="recommended">Recomendados</option>
                                <option value="bestsellers">Más Vendidos</option>
                                <option value="price-asc">Menor Precio</option>
                                <option value="price-desc">Mayor Precio</option>
                            </select>
                        </div>
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

                    {paginatedProducts.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Filter className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Intenta cambiar los filtros seleccionados.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setShowOffersOnly(false);
                                        setSelectedBrands([]);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Ver todos los productos
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {paginatedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        isPopular={popularProductIds.includes(product.id)}
                                    />
                                ))}
                            </div>

                            {/* Pagination Bar */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md border ${currentPage === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div >
        </div >
    );
};
