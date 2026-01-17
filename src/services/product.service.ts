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
                    resolve(productsData as Product[]);
                }
            }, 500);
        });
    },

    getById: async (id: string): Promise<Product | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const product = (productsData as Product[]).find(p => p.id === id);
                resolve(product);
            }, 500);
        });
    }
};
