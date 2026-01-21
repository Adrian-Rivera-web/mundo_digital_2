import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../types';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { MundoBitIcon } from '../../components/ui/MundoBitIcon';

export const BitsStorePage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const allProducts = await ProductService.getAll();
            // Filter bits store items (In a real app, this flag would be set by admin)
            // For demo, let's filter or mock some if none exist
            const bitItems = allProducts.filter(p => p.isBitStoreItem);

            // If no items are marked yet, let's mock one for visualization
            if (bitItems.length === 0 && allProducts.length > 0) {
                // Temporary mock for demo purposes
                const mockItem = { ...allProducts[0], id: 'bit-1', name: 'Pack Gamer Mundo Bits', price: 0, bitPrice: 5000, isBitStoreItem: true, description: 'Pack exclusivo canjeable solo con Bits.' };
                setProducts([mockItem]);
            } else {
                setProducts(bitItems);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                        Mundo Bits Store
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Canjea tus bits acumulados por productos exclusivos.
                    </p>
                </div>
                <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-2xl shadow-xl text-white min-w-[300px]">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Tu Saldo Actual</p>
                    <div className="flex items-center gap-3">
                        <MundoBitIcon className="text-yellow-400" size={32} />
                        <span className="text-4xl font-black">{user.bits.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader className="animate-spin text-purple-600" size={48} />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <MundoBitIcon size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aún no hay productos exclusivos</h3>
                    <p className="text-gray-500">Vuelve pronto para ver nuevas recompensas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-purple-100 dark:border-purple-900/30 transition-transform hover:-translate-y-2">
                            <div className="relative h-64 overflow-hidden group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-black shadow-lg">
                                    EXCLUSIVO
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>

                                <div className="flex justify-between items-center">
                                    <div className="text-purple-600 dark:text-purple-400 font-black text-2xl">
                                        {product.bitPrice?.toLocaleString()} Bits
                                    </div>
                                    <button
                                        disabled={user.bits < (product.bitPrice || 999999)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all ${user.bits >= (product.bitPrice || 999999)
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {user.bits >= (product.bitPrice || 999999) ? 'Canjear' : 'Faltan Bits'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
