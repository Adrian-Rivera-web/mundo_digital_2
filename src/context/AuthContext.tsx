import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/auth.service';
import { useCartStore } from '../hooks/useCartStore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<User | null>;
    register: (name: string, email: string, rut: string, phone: string, password?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => void;
    toggleWishlist: (productId: string) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedUser = AuthService.getCurrentUser();
            setUser(storedUser);
            // Sync cart user
            if (storedUser) {
                useCartStore.getState().setActiveUser(storedUser.id);
            } else {
                useCartStore.getState().setActiveUser('guest');
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password?: string): Promise<User | null> => {
        try {
            const user = await AuthService.login(email, password);
            if (user) {
                setUser(user);
                useCartStore.getState().setActiveUser(user.id);
                return user;
            }
        } catch (error) {
            console.error('Login error in context:', error);
        }
        return null;
    };

    const register = async (name: string, email: string, rut: string, phone: string, password?: string): Promise<void> => {
        const user = await AuthService.register(name, email, rut, phone, password);
        setUser(user);
        useCartStore.getState().setActiveUser(user.id);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        useCartStore.getState().setActiveUser('guest');
    };

    const refreshUser = () => {
        const storedUser = AuthService.getCurrentUser();
        setUser(storedUser);
        if (storedUser) {
            useCartStore.getState().setActiveUser(storedUser.id);
        }
    };

    const toggleWishlist = (productId: string) => {
        if (!user) return;

        const currentWishlist = user.wishlist || [];
        let newWishlist: string[];

        if (currentWishlist.includes(productId)) {
            newWishlist = currentWishlist.filter(id => id !== productId);
        } else {
            newWishlist = [...currentWishlist, productId];
        }

        const updatedUser = { ...user, wishlist: newWishlist };
        setUser(updatedUser);
        AuthService.updateUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            refreshUser,
            toggleWishlist,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
