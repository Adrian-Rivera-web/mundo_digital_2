import { useEffect, useState } from 'react';

import type { Order } from '../../types';
import { DollarSign, Package, ShoppingBag, Clock } from 'lucide-react';
import { ProductService } from '../../services/product.service';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        productsSold: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const ordersStr = localStorage.getItem('mundo_digital_orders');
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];

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
                lowStockItems: lowStockProducts
            } as any);
        };
        fetchStats();
    }, []);

    const cards = [
        { name: 'Ingresos Totales', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { name: 'Contador Pedidos', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
        { name: 'Pendientes de Envío', value: stats.pendingOrders, icon: Clock, color: 'bg-yellow-500' },
        { name: 'Stock Crítico (<3)', value: (stats as any).lowStockCount || 0, icon: Package, color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                <p className="text-gray-500">Resumen y métricas de tu tienda.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white overflow-hidden shadow-sm border border-gray-100 rounded-xl">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className={`rounded-xl p-3 ${card.color} bg-opacity-10`}>
                                    <card.icon className={`h-6 w-6 ${(card as any).color.replace('bg-', 'text-')}`} aria-hidden="true" />
                                </div>
                                <div className="ml-5">
                                    <p className="text-sm font-medium text-gray-500 truncate">{card.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Low Stock Alert Section */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2 text-red-500" /> Alertas de Inventario Bajo
                    </h2>
                    <div className="space-y-4">
                        {(stats as any).lowStockItems && (stats as any).lowStockItems.length > 0 ? (
                            (stats as any).lowStockItems.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <img src={item.image} className="h-10 w-10 rounded object-cover mr-3" alt="" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <span className="text-red-700 font-bold text-sm">Quedan: {item.stock}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500 italic">
                                Todo el inventario está en niveles óptimos.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sales Activity Section */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        < DollarSign className="h-5 w-5 mr-2 text-green-500" /> Rendimiento de Ventas
                    </h2>
                    <div className="h-64 flex flex-col justify-end space-y-2">
                        {/* CSS Bar Chart Simulation */}
                        <div className="flex items-end justify-between h-48 px-4">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="flex flex-col items-center group relative">
                                    <div
                                        className="w-8 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                                            ${(h * 100).toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-2 uppercase">Día {i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 pt-4 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ventas de los últimos 7 días</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
