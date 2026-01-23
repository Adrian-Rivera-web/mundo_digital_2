export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    discountPrice?: number;
    isBitStoreItem?: boolean;
    bitPrice?: number;
    brand?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'ADMIN' | 'SUPERADMIN';
    rut?: string;
    phone?: string;
    address?: string;
    password?: string;
    // Loyalty - Mundo Bits
    bits: number;
    totalBitsDetails: number;
    tier: 'BIT' | 'BYTE' | 'GIGA';
    wishlist?: string[];
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    shippingType: 'PICKUP' | 'DELIVERY';
    shippingAddress?: string;
    // Loyalty
    redeemedBits?: number;
    earnedBits?: number;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    image: string;
}

export interface Coupon {
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    value: number; // e.g., 10 for 10% or 5000 for $5000
    minPurchase?: number;
    active: boolean;
    usageLimit?: number; // Total global uses
    usedCount: number;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}
