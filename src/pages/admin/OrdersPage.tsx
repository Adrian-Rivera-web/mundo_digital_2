import { useEffect, useState } from 'react';
import type { Order } from '../../types';
import { CheckCircle, Truck, XCircle, Search, Filter } from 'lucide-react';

export const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Pagination Logic
    const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Gestión de Pedidos</h1>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                        placeholder="Buscar por ID de pedido o usuario..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page on search
                        }}
                    />
                </div>
                <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1); // Reset page on filter
                        }}
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="PAID">Pagados</option>
                        <option value="SHIPPED">Enviados</option>
                        <option value="DELIVERED">Entregados</option>
                        <option value="CANCELLED">Cancelados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrders.length === 0 && <li className="p-8 text-center text-gray-500 dark:text-gray-400">No se encontraron pedidos.</li>}
                    {paginatedOrders.map((order) => (
                        <li key={order.id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                                        Pedido #{order.id}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            Usuario ID: {order.userId}
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                                            Total: ${order.total.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
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

            {/* Pagination Controls */}
            {
                filteredOrders.length > itemsPerPage && (
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 mt-4 rounded-md shadow">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                disabled={currentPage === pageCount}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> de <span className="font-medium">{filteredOrders.length}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Anterior</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0">
                                        Página {currentPage} de {pageCount}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                                        disabled={currentPage === pageCount}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Siguiente</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
