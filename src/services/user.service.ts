import type { User } from '../types';
import api from '../api/axios';

export const UserService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    update: async (userId: string, data: Partial<User>): Promise<User> => {
        const response = await api.put(`/users/${userId}`, data);
        return response.data;
    },

    delete: async (userId: string): Promise<void> => {
        await api.delete(`/users/${userId}`);
    },

    // Helper para cambiar rol específicamente
    updateRole: async (userId: string, role: 'ADMIN' | 'CLIENT' | 'SUPERADMIN'): Promise<User> => {
        const response = await api.put(`/users/${userId}`, { role });
        return response.data;
    }
};
