import { useEffect, useState } from 'react';

import type { Order } from '../../types';
import { DollarSign, Package, ShoppingBag, Clock } from 'lucide-react';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        productsSold: 0
    });

    useEffect(() => {
        // Mock fetching all orders (in real app, we would have an endpoint for stats or admin-all-orders)
        // Since we only have 'getOrdersByUser', let's mock reading from localStorage directly here or add a service method.
        // Let's assume OrderService.getAllOrders() exists or we simulate it.
        const fetchStats = async () => {
            // Quick hack for MVP: Read directly from localStorage or add to Service
            const ordersStr = localStorage.getItem('mundo_digital_orders');
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];

            const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
            const productsSold = orders.reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);

            setStats({
                totalRevenue,
                totalOrders: orders.length,
                pendingOrders,
                productsSold
            });
        };
        fetchStats();
    }, []);

    const cards = [
        { name: 'Ingresos Totales', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { name: 'Contador Pedidos', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
        { name: 'Pendientes de Pago', value: stats.pendingOrders, icon: Clock, color: 'bg-yellow-500' },
        { name: 'Productos Vendidos', value: stats.productsSold, icon: Package, color: 'bg-indigo-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`rounded-md p-3 ${card.color}`}>
                                        <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                                        <dd className="text-lg font-medium text-gray-900">{card.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
                <div className="mt-4 bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500">Aquí se mostraría un gráfico o tabla de los últimos movimientos.</p>
                </div>
            </div>
        </div>
    );
};
