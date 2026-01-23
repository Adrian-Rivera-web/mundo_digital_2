import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { useCartStore } from '../../hooks/useCartStore';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import { ProductReviews } from '../../components/shop/ProductReviews';
import { ReviewService } from '../../services/review.service';
import { StarRating } from '../../components/ui/StarRating';

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBestSeller, setIsBestSeller] = useState(false);
    const { addItem, getProductQuantity } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const data = await ProductService.getById(id);
                    setProduct(data || null);

                    // Check if best seller
                    const bestSellers = await ProductService.getBestSellers(3);
                    if (data && bestSellers.some(p => p.id === data.id)) {
                        setIsBestSeller(true);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const cartQuantity = product ? getProductQuantity(product.id) : 0;
    const isMaxStock = product ? cartQuantity >= product.stock : false;

    const handleAddToCart = () => {
        if (!product || isMaxStock) return;
        setIsAdding(true);
        addItem(product);
        setTimeout(() => setIsAdding(false), 500);
    };

    if (loading) return <div className="text-center py-20">Cargando...</div>;

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                <Link to="/" className="text-blue-600 hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
            <div className="md:flex">
                {/* Gallery Section */}
                <div className="md:w-1/2 p-8 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-96 w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-8">
                    <div className="mb-4">
                        <Link to="/" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                        </Link>
                    </div>

                    <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase text-sm">
                        {product.category}
                    </span>
                    <div className="flex items-center mt-2 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {product.name}
                        </h1>
                        {isBestSeller && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 ml-3">
                                🔥 Más Popular
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={ReviewService.getAverageRating(product.id).average} size={18} />
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            ({ReviewService.getAverageRating(product.id).count} reseñas)
                        </span>
                    </div>

                    <div className="mb-6">
                        {product.discountPrice ? (
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-bold text-red-600 dark:text-red-400">
                                    {formatPrice(product.discountPrice)}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-md text-sm font-bold">
                                    AHORRA {formatPrice(product.price - product.discountPrice)}
                                </span>
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(product.price)}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8 space-y-4">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Truck className="h-5 w-5 mr-3 text-blue-500" />
                            <span>Envío a domicilio disponible</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <ShieldCheck className="h-5 w-5 mr-3 text-green-500" />
                            <span>Garantía de 12 meses directa</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding || isMaxStock}
                            className={`flex-1 inline-flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white ${product.stock > 0 && !isMaxStock
                                ? isAdding ? 'bg-green-600' : 'bg-primary-600 hover:bg-primary-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            {product.stock === 0 ? 'Agotado' : isMaxStock ? 'Stock Máximo en Carrito' : isAdding ? 'Agregado al Carrito' : 'Agregar al Carrito'}
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        Stock disponible: {Math.max(0, product.stock - cartQuantity)} unidades
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-8">
                <div className="max-w-4xl mx-auto">
                    <ProductReviews productId={product.id} />
                </div>
            </div>
        </div>
    );
};
