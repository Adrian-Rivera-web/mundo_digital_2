import type { User } from '../types';

const USERS_KEY = 'mundo_digital_users';
const CURRENT_USER_KEY = 'mundo_digital_current_user';

const INITIAL_ADMIN: User = {
    id: 'admin-1',
    email: 'admin@mundodigital.com',
    name: 'Super Admin',
    role: 'SUPERADMIN',
    password: 'admin123',
    bits: 10000,
    totalBitsDetails: 10000,
    tier: 'BYTE'
};

export const AuthService = {
    login: async (email: string, password?: string): Promise<User | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Check if it's the hardcoded admin
                if (email === INITIAL_ADMIN.email) {
                    if (password === INITIAL_ADMIN.password) {
                        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_ADMIN));
                        resolve(INITIAL_ADMIN);
                    } else {
                        resolve(null);
                    }
                    return;
                }

                // Check registered users
                const usersStr = localStorage.getItem(USERS_KEY);
                const users: User[] = usersStr ? JSON.parse(usersStr) : [];
                const user = users.find(u => u.email === email);

                if (user && user.password === password) {
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
                    resolve(user);
                } else {
                    resolve(null);
                }
            }, 500); // Fake delay
        });
    },

    register: async (name: string, email: string, rut: string, phone: string, password?: string): Promise<User> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    email,
                    rut,
                    phone,
                    role: 'CLIENT',
                    password: password || '123456', // Fallback for old tests
                    bits: 0,
                    totalBitsDetails: 0,
                    tier: 'BIT'
                };

                const usersStr = localStorage.getItem(USERS_KEY);
                const users: User[] = usersStr ? JSON.parse(usersStr) : [];

                users.push(newUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

                resolve(newUser);
            }, 500);
        });
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    updateUser: (user: User): void => {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

        // Update in the main users list as well
        const usersStr = localStorage.getItem(USERS_KEY);
        if (usersStr) {
            const users: User[] = JSON.parse(usersStr);
            const updatedUsers = users.map(u => u.id === user.id ? user : u);
            localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        }
    }
};
