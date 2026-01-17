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
                    <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 w-full object-cover rounded-md border border-gray-200"
                        />
                        <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="px-2 text-gray-700 font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                    disabled={item.quantity >= item.stock}
                                >
                                    <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="ml-4 w-24 text-right font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
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
