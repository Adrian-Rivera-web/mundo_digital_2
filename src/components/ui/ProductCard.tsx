import type { Product } from '../../types';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addItem = useCartStore(state => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem(product);
        // Visual feedback simulation
        setTimeout(() => setIsAdding(false), 500);
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
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                        className={`
              inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white transition-colors
              ${product.stock > 0
                                ? isAdding ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'}
            `}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isAdding ? 'Agregado' : 'Agregar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
