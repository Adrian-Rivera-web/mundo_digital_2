import type { Product } from '../../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
    isPopular?: boolean;
}

export const ProductCard = ({ product, isPopular }: ProductCardProps) => {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <Link to={`/product/${product.id}`} className="relative pt-[75%] bg-gray-100 block group">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock === 0 && (
                    <div className="absolute top-0 right-0 m-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        AGOTADO
                    </div>
                )}
                {product.discountPrice && product.stock > 0 && (
                    <div className="absolute top-0 left-0 m-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                        OFERTA
                    </div>
                )}
                {isPopular && product.stock > 0 && (
                    <div className={`absolute top-0 ${product.discountPrice ? 'left-20' : 'left-0'} m-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200 z-10`}>
                        🔥 Popular
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                </div>
                <Link to={`/product/${product.id}`} className="hover:text-blue-600">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        {product.discountPrice ? (
                            <>
                                <span className="text-xl font-bold text-red-600">
                                    {formatPrice(product.discountPrice)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
