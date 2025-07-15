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
            localStorage.setItem('username', username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            await fetchUser(accessToken);
        } catch (error: any) {
            // Check if error is an Axios error
            if (error.response) {
                // Throw the actual error response so it can be handled in the component
                throw error.response;
            } else {
                console.error('Unexpected login error:', error);
                throw new Error('Unexpected error occurred during login');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setAuth({ accessToken: null, user: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
