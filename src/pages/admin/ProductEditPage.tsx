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

        // Ensure numbers
        data.price = Number(data.price);
        data.stock = Number(data.stock);

        // Sanitize optional discount
        if (!data.discountPrice || isNaN(data.discountPrice)) {
            delete data.discountPrice;
        } else {
            data.discountPrice = Number(data.discountPrice);
        }

        // Default image if missing
        if (!data.image) {
            data.image = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000";
        }

        try {
            if (isNew) {
                await ProductService.create(data);
                console.log('Product created successfully');
            } else if (id) {
                await ProductService.update(id, data);
                console.log('Product updated successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Error al guardar el producto. Revisa la consola o intenta nuevamente.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 shadow rounded-lg border border-gray-100 dark:border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                    <input {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                    <textarea {...register('description')} rows={3} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio Normal</label>
                        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border font-semibold" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-red-600 dark:text-red-400">Precio Oferta (Opcional)</label>
                        <input type="number" step="0.01" {...register('discountPrice', {
                            valueAsNumber: true,
                            setValueAs: v => v === "" ? undefined : parseFloat(v)
                        })} className="mt-1 block w-full border-red-200 dark:border-red-900/50 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 border font-bold" placeholder="Ej: 99.99" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                        <input type="number" {...register('stock', { valueAsNumber: true })} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                    <input {...register('category')} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                    <input {...register('brand', { required: true })} placeholder="Ej: Samsung, Sony, Genérica" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Imagen</label>
                    <input {...register('image')} className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border" />
                </div>

                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => navigate('/admin/products')} className="mr-3 bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors">
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
