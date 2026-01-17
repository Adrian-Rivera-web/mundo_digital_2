export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'ADMIN' | 'SUPERADMIN';
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
}
