import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { Edit2, Plus, Trash2 } from 'lucide-react';

// Hack to simulate delete in memory/localStorage without real backend
const getLocalProducts = async (): Promise<Product[]> => {
    // Check if we have modified products in localStorage
    const localStr = localStorage.getItem('mundo_digital_products');
    if (localStr) return JSON.parse(localStr);

    // Fallback to initial service data
    return await ProductService.getAll();
};

export const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getLocalProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            const updated = products.filter(p => p.id !== id);
            setProducts(updated);
            localStorage.setItem('mundo_digital_products', JSON.stringify(updated));
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Gestión de Productos</h1>
                <Link to="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-5 w-5 mr-2" /> Nuevo Producto
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <li key={product.id}>
                            <div className="px-4 py-4 flex items-center sm:px-6">
                                <img className="h-10 w-10 rounded-full object-cover mr-4" src={product.image} alt="" />
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex text-sm font-medium text-blue-600 truncate">
                                            {product.name}
                                        </div>
                                        <div className="flex text-xs text-gray-500">
                                            <p>{product.category}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-5 flex-shrink-0">
                                    <div className="flex space-x-4">
                                        <div className="text-sm text-gray-900 font-bold">
                                            ${product.price.toLocaleString()}
                                        </div>
                                        <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0
                                            ? product.stock < 3 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'}`}>
                                            Stock: {product.stock} {product.stock > 0 && product.stock < 3 && '⚠️'}
                                        </div>
                                        <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            <Edit2 className="h-5 w-5" />
                                        </Link>
                                        {/* Delete button logic would go here */}
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
