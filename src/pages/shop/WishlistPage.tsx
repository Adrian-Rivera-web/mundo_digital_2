import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../types';
import { ProductCard } from '../../components/ui/ProductCard';
import { Heart, Loader, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const WishlistPage = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        const loadWishlistProducts = async () => {
            if (!user || !user.wishlist || user.wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            const allProducts = await ProductService.getAll();
            const wishlistProducts = allProducts.filter(p => user.wishlist?.includes(p.id));
            setProducts(wishlistProducts);
            setLoading(false);
        };

        if (user) {
            loadWishlistProducts();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, user?.wishlist]); // Re-run when wishlist changes

    if (authLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="text-red-500 fill-red-500 w-8 h-8" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Favoritos</h1>
                <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    ({products.length})
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader className="animate-spin text-blue-600" size={48} />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tu lista de deseos está vacía</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Explora nuestro catálogo y guarda los productos que más te gusten.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Ir al Catálogo
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setCurrentPage(p => Math.max(1, p - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
                            </button>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                Página {currentPage} de {Math.ceil(products.length / ITEMS_PER_PAGE)}
                            </span>
                            <button
                                onClick={() => {
                                    setCurrentPage(p => Math.min(Math.ceil(products.length / ITEMS_PER_PAGE), p + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage >= Math.ceil(products.length / ITEMS_PER_PAGE)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-white" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
