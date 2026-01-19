import type { Product } from '../types';
import productsData from '../data/products.json';

export const ProductService = {
    getAll: async (): Promise<Product[]> => {
        // Simulating network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const localStr = localStorage.getItem('mundo_digital_products');
                if (localStr) {
                    resolve(JSON.parse(localStr));
                } else {
                    const products = productsData as Product[];
                    // Persist initial data so stock can be deducted even if admin hasn't edited anything yet
                    localStorage.setItem('mundo_digital_products', JSON.stringify(products));
                    resolve(products);
                }
            }, 500);
        });
    },

    getById: async (id: string): Promise<Product | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const localStr = localStorage.getItem('mundo_digital_products');
                let products: Product[];

                if (localStr) {
                    products = JSON.parse(localStr);
                } else {
                    products = productsData as Product[];
                }

                const product = products.find(p => p.id === id);
                resolve(product);
            }, 500);
        });
    }
};
