import type { Order, CartItem } from '../types';
import api from '../api/axios';

export const OrderService = {
    createOrder: async (userId: string, items: CartItem[], total: number, shippingData: any, loyalty?: { redeemed: number, earned: number }): Promise<Order> => {
        try {
            const payload = {
                userId,
                items: items.map(item => {
                    const price = item.discountPrice || item.price;
                    return {
                        product: (item as any)._id || item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: price,
                        subtotal: price * item.quantity
                    };
                }),
                total,
                shippingAddress: shippingData.address || "Retiro en Sucursal",
                shippingType: shippingData.shippingType,
                loyalty: loyalty
            };
            console.log('Creating Order payload (JSON):', JSON.stringify(payload, null, 2));

            const response = await api.post('/orders', payload);
            return {
                ...response.data,
                id: response.data._id || response.data.id
            };
        } catch (error: any) {
            console.error('Error creating order:', error);
            if (error.response) {
                console.error('Order Backend Error Details:', error.response.data);
            }
            throw error;
        }
    },

    getOrdersByUser: async (userId: string): Promise<Order[]> => {
        try {
            const response = await api.get(`/orders/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    getOrderById: async (id: string): Promise<Order | undefined> => {
        try {
            const response = await api.get(`/orders/${id}`);
            if (response.data) {
                return {
                    ...response.data,
                    id: response.data._id || response.data.id
                };
            }
            return undefined;
        } catch (error) {
            console.error("Error fetching order by ID", error);
            return undefined;
        }
    },
    getDashboardStats: async (): Promise<any> => {
        try {
            const response = await api.get('/orders/dashboard');
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            return {
                totalRevenue: 0,
                totalOrders: 0,
                pendingOrders: 0,
                productsSold: 0,
                recentOrders: []
            };
        }
    }
};
