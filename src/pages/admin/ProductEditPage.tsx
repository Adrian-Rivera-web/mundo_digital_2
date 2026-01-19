import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../../types';
import { ProductService } from '../../services/product.service';

export const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    // We reuse the interface but make id optional for form handling
    const { register, handleSubmit, reset } = useForm<Product>();

    useEffect(() => {
        if (!isNew && id) {
            loadProduct(id);
        }
    }, [id, isNew]);

    const loadProduct = async (productId: string) => {
        // Tries to find in localStorage first, then Service
        const localStr = localStorage.getItem('mundo_digital_products');
        let product: Product | undefined;

        if (localStr) {
            const products = JSON.parse(localStr) as Product[];
            product = products.find(p => p.id === productId);
        }

        if (!product) {
            product = await ProductService.getById(productId);
        }

        if (product) {
            reset(product);
        }
    };

    const onSubmit = async (formData: Product) => {
        const data = { ...formData };
        if (!data.discountPrice || isNaN(data.discountPrice)) {
            delete data.discountPrice;
        }

        const localStr = localStorage.getItem('mundo_digital_products');
        let products: Product[] = await ProductService.getAll(); // fallback base

        if (localStr) {
            products = JSON.parse(localStr);
        } else {
            // First time editing? snapshot all current server products to local
            localStorage.setItem('mundo_digital_products', JSON.stringify(products));
        }

        if (isNew) {
            const newProduct = { ...data, id: Math.random().toString(36).substr(2, 9) };
            products.push(newProduct);
        } else {
            products = products.map(p => p.id === id ? { ...p, ...data } : p);
        }

        localStorage.setItem('mundo_digital_products', JSON.stringify(products));
        navigate('/admin/products');
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea {...register('description')} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Normal</label>
                        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border font-semibold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-red-600">Precio Oferta (Opcional)</label>
                        <input type="number" step="0.01" {...register('discountPrice', {
                            valueAsNumber: true,
                            setValueAs: v => v === "" ? undefined : parseFloat(v)
                        })} className="mt-1 block w-full border-red-200 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 bg-red-50 border font-bold text-red-700" placeholder="Ej: 99.99" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" {...register('stock', { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <input {...register('category')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">URL Imagen</label>
                    <input {...register('image')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-gray-50 border" />
                </div>

                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => navigate('/admin/products')} className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        Cancelar
                    </button>
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};
