import type { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReviewService } from '../../services/review.service';
import { StarRating } from './StarRating';

interface ProductCardProps {
    product: Product;
    isPopular?: boolean;
}

export const ProductCard = ({ product, isPopular }: ProductCardProps) => {
    const { user, toggleWishlist } = useAuth();
    const navigate = useNavigate();
    const isLiked = user?.wishlist?.includes(product.id);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product detail
        e.stopPropagation();

        if (!user) {
            // Optional: Create a toast or redirect to login
            if (confirm("Inicia sesión para guardar productos en tu lista de deseos.")) {
                navigate('/login');
            }
            return;
        }

        toggleWishlist(product.id);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:ring-2 hover:ring-primary-500 transition-all duration-300 flex flex-col h-full group">
            <Link to={`/product/${product.id}`} className="relative pt-[75%] bg-gray-100 dark:bg-gray-700 block overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock === 0 && (
                    <div className="absolute top-0 left-0 m-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                        AGOTADO
                    </div>
                )}
                {product.discountPrice && product.stock > 0 && (
                    <div className="absolute top-0 left-0 m-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10">
                        OFERTA
                    </div>
                )}
                {isPopular && product.stock > 0 && (
                    <div className={`absolute top-0 ${product.discountPrice ? 'left-20' : 'left-0'} m-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10`}>
                        🔥 Popular
                    </div>
                )}

                <button
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md z-20 hover:scale-110 transition-transform group"
                    title={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300 hover:text-red-500'}`}
                    />
                </button>
            </Link>

            <div className="p-4 flex flex-col flex-grow relative z-10">
                <div className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mb-1">
                    {product.category}
                </div>
                <Link to={`/product/${product.id}`} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <div className="mb-2">
                    <StarRating rating={ReviewService.getAverageRating(product.id).average} size={14} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {formatPrice(product.discountPrice)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    {/* Optional Add Button could go here */}
                </div>
            </div>
        </div >
    );
};
