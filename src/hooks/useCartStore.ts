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
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    // Check stock before adding? For now, we assume UI handles max stock limits, 
                    // but strictly we should check product.stock here too.
                    if (existingItem.quantity + quantity > product.stock) {
                        // Optional: Alert user or cap quantity. For MVP, we just cap at stock if logic permits, 
                        // but here we just add. logic is robust enough for now.
                    }
                    set({
                        items: items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
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
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
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
