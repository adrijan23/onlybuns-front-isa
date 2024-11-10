import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../config/axiosConfig';

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: { name: string }[];
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
}

interface AuthContextType {
    auth: AuthState;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

interface Props {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        accessToken: null,
        user: null,
        loading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser(token);
        } else {
            setAuth({ accessToken: null, user: null, loading: false });
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const response = await axios.get<User>('/api/whoami');
            setAuth({ accessToken: token, user: response.data, loading: false });
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/auth/login', { username, password });
            const { accessToken } = response.data;

            localStorage.setItem('token', accessToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            await fetchUser(accessToken);
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Invalid username or password');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setAuth({ accessToken: null, user: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
