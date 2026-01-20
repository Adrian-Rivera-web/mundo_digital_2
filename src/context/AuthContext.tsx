import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<boolean>;
    register: (name: string, email: string, rut: string, phone: string, password?: string) => Promise<void>;
    logout: () => void;
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
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password?: string): Promise<boolean> => {
        const user = await AuthService.login(email, password);
        if (user) {
            setUser(user);
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, rut: string, phone: string, password?: string): Promise<void> => {
        const user = await AuthService.register(name, email, rut, phone, password);
        setUser(user);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
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
