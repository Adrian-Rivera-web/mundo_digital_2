import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { Edit2, Plus, Trash2 } from 'lucide-react';

useEffect(() => {
    loadProducts();
}, []);

const loadProducts = async () => {
    setLoading(true);
    try {
        const data = await ProductService.getAll();
        setProducts(data);
    } catch (error) {
        console.error("Error loading products:", error);
    } finally {
        setLoading(false);
    }
};

const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const success = await ProductService.delete(id);
        if (success) {
            // Actualizar estado local eliminando el producto borrado
            setProducts(prev => prev.filter(p => p.id !== id));
        } else {
            alert('Hubo un error al eliminar el producto.');
        }
    }
};

if (loading) return <div>Cargando...</div>;

return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestión de Productos</h1>
            <Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" /> Nuevo Producto
            </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Pagination Logic */}
                {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                    <li key={product.id}>
                        <div className="px-4 py-4 flex items-center sm:px-6">
                            <img className="h-10 w-10 rounded-full object-cover mr-4" src={product.image} alt="" />
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                                        {product.name}
                                    </div>
                                    <div className="flex text-xs text-gray-500 dark:text-gray-400">
                                        <p>{product.category}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                                <div className="flex space-x-4">
                                    <div className="text-sm text-gray-900 dark:text-white font-bold">
                                        ${product.price.toLocaleString()}
                                    </div>
                                    <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0
                                        ? product.stock < 3 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'}`}>
                                        Stock: {product.stock} {product.stock > 0 && product.stock < 3 && '⚠️'}
                                    </div>
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        <Edit2 className="h-5 w-5" />
                                    </Link>
                                    {/* Delete button logic would go here */}
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {/* Pagination Controls */}
        {products.length > itemsPerPage && (
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
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / itemsPerPage), p + 1))}
                        disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, products.length)}</span> de <span className="font-medium">{products.length}</span> resultados
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
                            {/* Simple Page Numbers - can be expanded for complex pagination */}
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0">
                                Página {currentPage} de {Math.ceil(products.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / itemsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
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
        )}
    </div>
);
};
