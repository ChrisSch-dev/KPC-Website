import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType } from '../types/blog';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Check for existing authentication on mount
    useEffect(() => {
        const authStatus = localStorage.getItem('blogAuth');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (password: string): Promise<boolean> => {
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (password === adminPassword) {
            setIsAuthenticated(true);
            localStorage.setItem('blogAuth', 'true');
            return true;
        }

        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('blogAuth');
    };

    const value: AuthContextType = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
