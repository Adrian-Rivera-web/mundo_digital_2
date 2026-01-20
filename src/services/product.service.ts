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
    },

    getBestSellers: async (limit: number = 4): Promise<Product[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 1. Get all orders
                const ordersStr = localStorage.getItem('mundo_digital_orders');
                const orders = ordersStr ? JSON.parse(ordersStr) : [];

                // 2. Calculate sales per product
                const salesMap: Record<string, number> = {};
                orders.forEach((order: any) => {
                    order.items.forEach((item: any) => {
                        salesMap[item.id] = (salesMap[item.id] || 0) + item.quantity;
                    });
                });

                // 3. Get all products to return full objects
                const localStr = localStorage.getItem('mundo_digital_products');
                let allProducts: Product[];
                if (localStr) {
                    allProducts = JSON.parse(localStr);
                } else {
                    allProducts = productsData as Product[];
                }

                // 4. Sort by sales count
                const sortedProducts = [...allProducts].sort((a, b) => {
                    const salesA = salesMap[a.id] || 0;
                    const salesB = salesMap[b.id] || 0;
                    return salesB - salesA;
                });

                resolve(sortedProducts.slice(0, limit));
            }, 500);
        });
    },

    getProductSalesMap: async (): Promise<Record<string, number>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const ordersStr = localStorage.getItem('mundo_digital_orders');
                const orders = ordersStr ? JSON.parse(ordersStr) : [];
                const salesMap: Record<string, number> = {};

                orders.forEach((order: any) => {
                    order.items.forEach((item: any) => {
                        salesMap[item.id] = (salesMap[item.id] || 0) + item.quantity;
                    });
                });

                resolve(salesMap);
            }, 500);
        });
    }
};
