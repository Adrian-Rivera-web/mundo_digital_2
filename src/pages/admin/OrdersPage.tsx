import { useEffect, useState } from 'react';
import type { Order } from '../../types';
import { CheckCircle, Truck, XCircle } from 'lucide-react';

export const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const ordersStr = localStorage.getItem('mundo_digital_orders');
        const allOrders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
        // Sort by newest
        setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, []);

    const updateStatus = (orderId: string, newStatus: Order['status']) => {
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);
        localStorage.setItem('mundo_digital_orders', JSON.stringify(updatedOrders));
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gestión de Pedidos</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.length === 0 && <li className="p-4 text-center text-gray-500">No hay pedidos registrados</li>}
                    {orders.map((order) => (
                        <li key={order.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">
                                        Pedido #{order.id}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Usuario ID: {order.userId}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            Total: ${order.total.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-2 justify-end">
                                    {order.status === 'PENDING' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'PAID')}
                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" /> Marcar Pagado
                                        </button>
                                    )}
                                    {order.status === 'PAID' && (
                                        <button
                                            onClick={() => updateStatus(order.id, 'SHIPPED')}
                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200"
                                        >
                                            <Truck className="h-4 w-4 mr-1" /> Marcar Enviado
                                        </button>
                                    )}
                                    {/* Simple debug/admin controls */}
                                    <button
                                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                    >
                                        <XCircle className="h-4 w-4 mr-1" /> Cancelar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
