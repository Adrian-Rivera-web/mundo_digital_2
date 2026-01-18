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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Carrito de Compras</h2>
                <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Vaciar Carrito
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                    <li key={item.id} className="px-4 py-6 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0">
                        {/* Image Container with fixed aspect ratio */}
                        <div className="h-24 w-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="sm:ml-6 flex-1 w-full">
                            <div className="flex justify-between">
                                <h3 className="text-base font-bold text-gray-900 line-clamp-1">{item.name}</h3>
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
                                        <span className="text-lg font-bold text-red-600">{formatPrice(item.discountPrice)}</span>
                                        <span className="text-sm text-gray-400 line-through">{formatPrice(item.price)}</span>
                                    </>
                                ) : (
                                    <span className="text-lg font-semibold text-gray-900">{formatPrice(item.price)}</span>
                                )}
                            </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="px-2 text-gray-900 font-bold w-10 text-center text-sm">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                                    disabled={item.quantity >= item.stock}
                                >
                                    <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="hidden sm:block">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                    title="Eliminar producto"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="text-right min-w-[100px]">
                                <p className="text-sm text-gray-500 uppercase font-semibold text-[10px] tracking-wider">Subtotal</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
                <div className="mt-6 flex justify-end">
                    <Link
                        to="/checkout"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Procesar Compra
                    </Link>
                </div>
            </div>
        </div>
    );
};
