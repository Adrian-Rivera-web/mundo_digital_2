import type { Product } from '../types';
import api from '../api/axios';

export const ProductService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/products');
            console.log('Products fetched (Raw):', response.data);
            // Ensure ID mapping: Prioritize _id (Mongo) over id (legacy/string)
            return response.data.map((p: any) => ({
                ...p,
                id: p._id || p.id
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    getById: async (id: string): Promise<Product | undefined> => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            return undefined;
        }
    },

    getBestSellers: async (limit: number = 4): Promise<Product[]> => {
        try {
            const response = await api.get('/products/best-sellers');
            return response.data.slice(0, limit);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
            return [];
        }
    },

    getProductSalesMap: async (): Promise<Record<string, number>> => {
        // Este endpoint podría no existir aún en backend, lo simulamos o pedimos crearlo
        // Por ahora retornamos objeto vacío para no romper
        return {};
    },

    create: async (product: Partial<Product>): Promise<Product | null> => {
        try {
            // The DB screenshots verify keys are in English (name, brand, etc.)
            // We revert the Spanish mapping and ensure brand is sent.
            const payload = {
                ...product,
                // Default brand if missing, as it appears required in DB items
                brand: product.brand || 'Genérica',
                // Map discountPrice to backend expectation if needed, but DB shows 'discountPrice' is not in the screenshot of item 0 (it has price).
                // Item 0 has 'id', 'name', 'brand'. 
                // We'll send exactly what the form gives + brand.
            };

            // Guard against huge Base64 strings
            if (payload.image && payload.image.length > 2000) {
                console.warn("Image URL is too long (likely Base64), replacing with default to avoid server crash.");
                payload.image = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000";
            }

            console.log('Creating Product payload (English):', JSON.stringify(payload, null, 2));
            const response = await api.post('/products', payload);
            return response.data;
        } catch (error: any) {
            console.error('Error creating product:', error);
            if (error.response) {
                console.error('Backend Error Details:', error.response.data);
            }
            throw error;
        }
    },

    update: async (id: string, product: Partial<Product>): Promise<Product | null> => {
        try {
            const response = await api.put(`/products/${id}`, product);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/products/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }
};
