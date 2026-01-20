import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
    items: CartItem[];
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
            getProductQuantity: (productId) => {
                const item = get().items.find(i => i.id === productId);
                return item ? item.quantity : 0;
            },
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    const totalQuantity = existingItem.quantity + quantity;
                    if (totalQuantity > product.stock) {
                        // Can't add more than stock
                        // We could also set it to max stock:
                        // set({ items: items.map(i => i.id === product.id ? {...i, quantity: product.stock} : i) });
                        return; // For now just do nothing if exceeds
                    }

                    set({
                        items: items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    if (quantity > product.stock) {
                        return; // Attempting to add more than stock initially
                    }
                    set({ items: [...items, { ...product, quantity }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter(item => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    )
                });
            },
            clearCart: () => set({ items: [] }),
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
            name: 'mundo-digital-cart',
        }
    )
);
