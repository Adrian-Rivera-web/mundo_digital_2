import { useState, useEffect } from 'react';
import { Download, Eye, Search, Printer, X } from 'lucide-react';
import type { Order } from '../../types';

export const InvoicesPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const loadOrders = () => {
            const ordersStr = localStorage.getItem('mundo_digital_orders');
            if (ordersStr) {
                setOrders(JSON.parse(ordersStr));
            }
        };
        loadOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Boletas</h1>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por número de pedido o ID de cliente..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio / Pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Emisión</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                                        No hay boletas disponibles para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                                            #BOL-{order.id.substring(0, 6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ID: {order.userId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 bg-blue-50 rounded" title="Ver Detalle"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="text-purple-600 hover:text-purple-900 p-1 bg-purple-50 rounded" title="Descargar PDF">
                                                    <Download className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal for Invoice Preview */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Vista Previa de Boleta</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>
                        <div id="printable-invoice" className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-black text-blue-600 tracking-tighter">MUNDO DIGITAL</h1>
                                    <p className="text-sm text-gray-500">Calle Nueva 1660, Huechuraba<br />Santiago, Chile</p>
                                </div>
                                <div className="text-right border-2 border-red-500 p-4 rounded-xl">
                                    <p className="text-red-500 font-bold">R.U.T.: 76.123.456-K</p>
                                    <p className="text-red-600 text-xl font-black uppercase">Boleta Electrónica</p>
                                    <p className="text-red-500 text-lg font-bold">Nº BOL-{selectedOrder.id.substring(0, 6).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg text-sm grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500">Fecha Emisión:</p>
                                    <p className="font-bold text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Cliente:</p>
                                    <p className="font-bold text-gray-900">{selectedOrder.userId}</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-800">
                                        <th className="py-2 text-sm font-bold text-gray-900">Cant.</th>
                                        <th className="py-2 text-sm font-bold text-gray-900">Producto</th>
                                        <th className="py-2 text-right text-sm font-bold text-gray-900">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 text-sm text-gray-900">{item.quantity}</td>
                                            <td className="py-3 text-sm text-gray-900">{item.name}</td>
                                            <td className="py-3 text-right text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end pt-4 border-t border-gray-800">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between items-center text-xl font-black">
                                        <span>TOTAL</span>
                                        <span>{formatPrice(selectedOrder.total)}</span>
                                    </div>
                                    <div className="text-[10px] text-center text-gray-400 mt-8 italic">
                                        Timbre Electrónico SII de prueba. Res. N° 0 de 2026. Verifique documento en www.sii.cl
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                            <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black font-bold">
                                <Printer className="h-4 w-4 mr-2" /> Imprimir
                            </button>
                            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-white">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
