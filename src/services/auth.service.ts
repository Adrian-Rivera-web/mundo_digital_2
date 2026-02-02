import type { User } from '../types';
import api from '../api/axios';

const CURRENT_USER_KEY = 'mundo_digital_current_user';
const TOKEN_KEY = 'token';

export const AuthService = {
    login: async (email: string, password?: string): Promise<User | null> => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const { id, nombre, email: userEmail, jwToken, role, bits, tier } = response.data;

                const user: User = {
                    id,
                    name: nombre,
                    email: userEmail,
                    role: role || 'CLIENT',
                    password: '',
                    bits: bits || 0,
                    totalBitsDetails: 0, // Si el backend no devuelve esto login, podría ser 0 o pedir 'me'
                    tier: tier || 'BIT',
                    rut: response.data.rut || '',
                    phone: response.data.phone || response.data.telefono || ''
                };

                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                localStorage.setItem(TOKEN_KEY, jwToken);
                return user;
            }
            return null;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (name: string, email: string, rut: string, phone: string, password?: string): Promise<User> => {
        try {
            // Note: Backend 'crearUsuario' usually mapped to /auth/register
            // Rut and Phone are not currently saved by the backend.
            // Now sending RUT and Phone to the backend
            const response = await api.post('/auth/register', {
                email,
                nombre: name,
                password,
                rut,
                phone
            });

            if (response.data.success) {
                // Determine what to return. The backend returns { success: true, usuario: "name", email: "email" }
                // We construct a User object similar to login to immediately sign them in or just return it.
                // Usually after register you might want to auto-login.

                const newUser: User = {
                    id: response.data.id || 'temp-id', // Backend might not return ID on create depending on implementation
                    name: response.data.nombre || response.data.usuario,
                    email: response.data.email,
                    rut,
                    phone,
                    role: response.data.role || 'CLIENT',
                    password: '',
                    bits: 0,
                    totalBitsDetails: 0,
                    tier: 'BIT'
                };

                // Optional: Auto-login logic could go here if the backend returned a token on register
                // For now, we just return the user, and the UI might redirect to login.
                return newUser;
            }
            throw new Error('Registration failed');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    updateUser: async (user: User): Promise<void> => {
        try {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            // Actualizar en backend
            await api.put(`/users/${user.id}`, {
                nombre: user.name,
                email: user.email,
                rut: user.rut,
                phone: user.phone
            });
        } catch (error) {
            console.error("Error updating user", error);
        }
    },

    getById: async (id: string): Promise<User | null> => {
        try {
            const response = await api.get(`/users/${id}`);
            const data = response.data;
            if (data) {
                return {
                    id: data._id || data.id,
                    name: data.nombre || data.name,
                    email: data.email,
                    role: data.role,
                    bits: data.bits || 0,
                    totalBitsDetails: data.totalBitsDetails || 0,
                    tier: data.tier || 'BIT',
                    rut: data.rut,
                    phone: data.phone,
                    wishlist: data.wishlist
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching user by ID", error);
            return null;
        }
    }
};
