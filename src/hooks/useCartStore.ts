import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
    items: CartItem[]; // For backward compatibility and easy access
    carts: Record<string, CartItem[]>; // Storage for all users
    activeUserId: string;
    setActiveUser: (userId: string | null) => void;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    getProductQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            carts: {
                guest: []
            },
            activeUserId: 'guest',

            setActiveUser: (userId) => {
                const newId = userId || 'guest';
                set((state) => ({
                    activeUserId: newId,
                    items: state.carts[newId] || []
                }));
            },

            getProductQuantity: (productId) => {
                const item = get().items.find(i => i.id === productId);
                return item ? item.quantity : 0;
            },

            addItem: (product, quantity = 1) => {
                const state = get();
                const currentUserId = state.activeUserId;
                const currentCart = state.carts[currentUserId] || [];

                const existingItem = currentCart.find(item => item.id === product.id);
                let newCart: CartItem[];

                if (existingItem) {
                    const totalQuantity = existingItem.quantity + quantity;
                    if (totalQuantity > product.stock) {
                        return;
                    }

                    newCart = currentCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    if (quantity > product.stock) {
                        return;
                    }
                    newCart = [...currentCart, { ...product, quantity }];
                }

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [currentUserId]: newCart
                    },
                    items: newCart
                }));
            },

            removeItem: (productId) => {
                const state = get();
                const currentUserId = state.activeUserId;
                const currentCart = state.carts[currentUserId] || [];
                const newCart = currentCart.filter(item => item.id !== productId);

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [currentUserId]: newCart
                    },
                    items: newCart
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;

                const state = get();
                const currentUserId = state.activeUserId;
                const currentCart = state.carts[currentUserId] || [];

                // Check stock limit
                const item = currentCart.find(i => i.id === productId);
                if (item && quantity > item.stock) return;

                const newCart = currentCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                );

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [currentUserId]: newCart
                    },
                    items: newCart
                }));
            },

            clearCart: () => {
                const state = get();
                const currentUserId = state.activeUserId;

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [currentUserId]: []
                    },
                    items: []
                }));
            },

            getTotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.discountPrice && item.discountPrice < item.price
                        ? item.discountPrice
                        : item.price;
                    return total + (price * item.quantity);
                }, 0);
            },

            getItemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'mundo-digital-cart-storage', // Updated name to avoid conflict/migration issues with old format if needed, or we could keep same name but might need to handle migration. safer to change name or handle data structure change. Changing name resets cart for everyone, which is probably fine for dev.

            // To be nicer, we could try to migrate old data, but given "development" environment, clearing is acceptable.
            // Let's stick with a new key to ensure clean slate and correct types.
        }
    )
);
