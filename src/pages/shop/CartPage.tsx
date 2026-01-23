import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';

export const CartPage = () => {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">Parece que no has agregado productos aún.</p>
                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Carrito de Compras</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Product List Column */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6 transition-colors duration-200">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Productos ({items.length})</h2>
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.map((item) => (
                                <li key={item.id} className="px-4 py-6 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    {/* Image Container with fixed aspect ratio */}
                                    <div className="h-24 w-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="sm:ml-6 flex-1 w-full">
                                        <div className="flex justify-between">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="sm:hidden text-red-500 p-1"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="mt-1 flex items-baseline space-x-2">
                                            {item.discountPrice ? (
                                                <>
                                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">{formatPrice(item.discountPrice)}</span>
                                                    <span className="text-sm text-gray-400 line-through">{formatPrice(item.price)}</span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatPrice(item.price)}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity and Actions */}
                                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                            </button>
                                            <span className="px-2 text-gray-900 dark:text-white font-bold w-10 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                            </button>
                                        </div>

                                        <div className="hidden sm:block">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 transition-colors"
                                                title="Eliminar producto"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="text-right w-36 flex-shrink-0">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold text-[10px] tracking-wider">Subtotal</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Seguir Comprando
                    </Link>
                </div>

                {/* Summary Column */}
                <div className="lg:w-96 flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 sticky top-24 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Resumen del Pedido</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>Subtotal base</span>
                                <span>{formatPrice(items.reduce((acc, item) => acc + (item.price * item.quantity), 0))}</span>
                            </div>
                            {items.some(i => i.discountPrice) && (
                                <div className="flex justify-between items-center text-sm font-medium text-green-600 dark:text-green-400">
                                    <span>Ahorro por ofertas</span>
                                    <span>-{formatPrice(items.reduce((acc, item) => acc + (item.discountPrice ? (item.price - item.discountPrice) * item.quantity : 0), 0))}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">IVA incluido</p>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-bold rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors mt-6 shadow-green-500/20"
                            >
                                Procesar Compra
                            </Link>

                            <div className="mt-6 flex justify-center space-x-2">
                                {/* Placeholder icons for payment methods if needed */}
                                <div className="h-6 w-10 bg-gray-100 dark:bg-gray-700 rounded transition-colors"></div>
                                <div className="h-6 w-10 bg-gray-100 dark:bg-gray-700 rounded transition-colors"></div>
                                <div className="h-6 w-10 bg-gray-100 dark:bg-gray-700 rounded transition-colors"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
