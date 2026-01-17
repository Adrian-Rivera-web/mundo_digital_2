import type { Order, CartItem } from '../types';

const ORDERS_KEY = 'mundo_digital_orders';

export const OrderService = {
    createOrder: async (userId: string, items: CartItem[], total: number, shippingData: any): Promise<Order> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newOrder: Order = {
                    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                    userId,
                    items,
                    total,
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                    shippingType: shippingData.shippingType,
                    shippingAddress: shippingData.address
                        ? `${shippingData.address}, ${shippingData.city}, ${shippingData.zip}`
                        : undefined
                };

                const ordersStr = localStorage.getItem(ORDERS_KEY);
                const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];

                orders.push(newOrder);
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

                resolve(newOrder);
            }, 500);
        });
    },

    getOrdersByUser: async (userId: string): Promise<Order[]> => {
        return new Promise((resolve) => {
            const ordersStr = localStorage.getItem(ORDERS_KEY);
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
            resolve(orders.filter(o => o.userId === userId));
        });
    },

    getOrderById: async (id: string): Promise<Order | undefined> => {
        return new Promise((resolve) => {
            const ordersStr = localStorage.getItem(ORDERS_KEY);
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
            resolve(orders.find(o => o.id === id));
        });
    }
};
