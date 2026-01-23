import { useEffect, useState } from 'react';

import type { Order } from '../../types';
import { DollarSign, Package, ShoppingBag, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { ProductService } from '../../services/product.service';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        productsSold: 0,
        recentOrders: [] as Order[],
        lowStockItems: [] as any[],
        lowStockCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const ordersStr = localStorage.getItem('mundo_digital_orders');
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];

            // Sort orders to get recent ones
            const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Get products to check low stock
            const localProductsStr = localStorage.getItem('mundo_digital_products');
            let products = [];
            if (localProductsStr) {
                products = JSON.parse(localProductsStr);
            } else {
                products = await ProductService.getAll();
            }

            const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
            const productsSold = orders.reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);

            const lowStockProducts = products.filter((p: any) => p.stock < 3);

            setStats({
                totalRevenue,
                totalOrders: orders.length,
                pendingOrders,
                productsSold,
                lowStockCount: lowStockProducts.length,
                lowStockItems: lowStockProducts,
                recentOrders: sortedOrders.slice(0, 5) // Last 5 orders
            });
        };
        fetchStats();
    }, []);

    const cards = [
        { name: 'Ingresos Totales', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Pedidos Totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Pendientes', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { name: 'Prod. Vendidos', value: stats.productsSold, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenido al panel de control de Mundo Digital.</p>
                </div>
                <div className="text-sm text-gray-400">
                    Última actualización: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className={`rounded-xl p-3 ${card.bg}`}>
                                    <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{card.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Sales Chart & Recent Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Sales Activity Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" /> Rendimiento de Ventas
                            </h2>
                            <select className="text-xs border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                                <option>Últimos 7 días</option>
                                <option>Este Mes</option>
                            </select>
                        </div>

                        <div className="h-64 flex flex-col justify-end space-y-2 mt-8">
                            {/* Improved Bar Chart Visuals */}
                            <div className="flex items-end justify-between h-48 px-2 sm:px-8 gap-2">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full max-w-[40px] h-full flex items-end">
                                            <div
                                                className="w-full bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all duration-300 relative group-hover:shadow-lg"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                ${(h * 15000).toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-2 font-medium">
                                            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pedidos Recientes</h2>
                            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                Ver todos <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {stats.recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                                                ${order.total.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No hay pedidos recientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Inventory Alerts & Quick Actions */}
                <div className="space-y-8">
                    {/* Low Stock Alert Section */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                                <Package className="h-5 w-5 mr-2 text-red-500" /> Stock Crítico
                            </h2>
                            {stats.lowStockCount > 0 && (
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{stats.lowStockCount}</span>
                            )}
                        </div>

                        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats.lowStockItems.length > 0 ? (
                                stats.lowStockItems.map((item: any) => (
                                    <div key={item.id} className="flex items-center p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <img src={item.image} className="h-10 w-10 rounded object-cover mr-3 bg-white" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Quedan: {item.stock} unidades</p>
                                        </div>
                                        <Link to={`/admin/products/edit/${item.id}`} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors">
                                            <ArrowRight className="h-4 w-4 text-red-400" />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto h-12 w-12 text-green-200 bg-green-50 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    </div>
                                    <p className="text-gray-500 text-sm">Inventario saludable</p>
                                </div>
                            )}
                        </div>
                        {stats.lowStockItems.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Link to="/admin/products" className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    Gestionar Inventario
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
import { CheckCircle } from 'lucide-react';
