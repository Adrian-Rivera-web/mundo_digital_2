import type { Order, CartItem, Product, User } from '../types';

const ORDERS_KEY = 'mundo_digital_orders';

export const OrderService = {
    createOrder: async (userId: string, items: CartItem[], total: number, shippingData: any, loyaltyData?: { redeemed: number, earned: number }): Promise<Order> => {
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
                        : undefined,
                    redeemedBits: loyaltyData?.redeemed || 0,
                    earnedBits: loyaltyData?.earned || 0
                };

                const ordersStr = localStorage.getItem(ORDERS_KEY);
                const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];

                orders.push(newOrder);
                localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

                // Deduct Stock
                const productsStr = localStorage.getItem('mundo_digital_products');
                if (productsStr) {
                    let products: Product[] = JSON.parse(productsStr);
                    items.forEach(orderItem => {
                        products = products.map(p =>
                            p.id === orderItem.id
                                ? { ...p, stock: Math.max(0, p.stock - orderItem.quantity) }
                                : p
                        );
                    });
                    localStorage.setItem('mundo_digital_products', JSON.stringify(products));
                }

                // Update User Bits & Tier
                if (loyaltyData) {
                    const usersStr = localStorage.getItem('mundo_digital_users');
                    if (usersStr) {
                        const users: User[] = JSON.parse(usersStr);
                        const userIndex = users.findIndex(u => u.id === userId);

                        if (userIndex !== -1) {
                            const user = users[userIndex];

                            // Initialize if missing
                            user.bits = user.bits || 0;
                            user.totalBitsDetails = user.totalBitsDetails || 0;

                            // Update logic
                            user.bits = user.bits - loyaltyData.redeemed + loyaltyData.earned;
                            user.totalBitsDetails = user.totalBitsDetails + loyaltyData.earned;

                            // Recalculate Tier (Simple logic duplication to avoid circular dependency or import issues for now)
                            // Ideally import LoyaltyService, but keeping it simple here
                            if (user.totalBitsDetails > 15000) user.tier = 'GIGA';
                            else if (user.totalBitsDetails > 5000) user.tier = 'BYTE';
                            else user.tier = 'BIT';

                            users[userIndex] = user;
                            localStorage.setItem('mundo_digital_users', JSON.stringify(users));

                            // Also update current user if it matches
                            const currentUserStr = localStorage.getItem('mundo_digital_current_user');
                            if (currentUserStr) {
                                const currentUser = JSON.parse(currentUserStr);
                                if (currentUser.id === userId) {
                                    localStorage.setItem('mundo_digital_current_user', JSON.stringify(user));
                                }
                            }
                        }
                    }
                }

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
