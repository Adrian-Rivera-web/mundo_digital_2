import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';
import { useCartStore } from '../../hooks/useCartStore';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore(state => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const data = await ProductService.getById(id);
                if (!data) {
                    // Handle not found
                }
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        setIsAdding(true);
        addItem(product);
        setTimeout(() => setIsAdding(false), 500);
    };

    if (loading) return <div className="text-center py-20">Cargando...</div>;

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                <Link to="/" className="text-blue-600 hover:underline">Volver al catálogo</Link>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
                {/* Gallery Section */}
                <div className="md:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-96 w-full object-contain mix-blend-multiply"
                    />
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-8">
                    <div className="mb-4">
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                        </Link>
                    </div>

                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                        {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                        {product.name}
                    </h1>

                    <div className="text-3xl font-bold text-gray-900 mb-6">
                        {formatPrice(product.price)}
                    </div>

                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="border-t border-b border-gray-200 py-6 mb-8 space-y-4">
                        <div className="flex items-center text-gray-700">
                            <Truck className="h-5 w-5 mr-3 text-blue-500" />
                            <span>Envío a domicilio disponible</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <ShieldCheck className="h-5 w-5 mr-3 text-green-500" />
                            <span>Garantía de 12 meses directa</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || isAdding}
                            className={`flex-1 inline-flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white ${product.stock > 0
                                    ? isAdding ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            {product.stock === 0 ? 'Agotado' : isAdding ? 'Agregado al Carrito' : 'Agregar al Carrito'}
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Stock disponible: {product.stock} unidades
                    </div>
                </div>
            </div>
        </div>
    );
};
