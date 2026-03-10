import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore authentication when app loads
    useEffect(() => {

        const checkAuth = async () => {

            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                // Attach token to all requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const res = await api.get('/auth/me');

                if (res.data?.user) {
                    setUser(res.data.user);
                }

            } catch (err) {

                console.error("Auth verification failed:", err);

                // Don't immediately remove token to prevent unnecessary logout
                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        checkAuth();

    }, []);


    const login = async (username, password) => {

        try {

            const res = await api.post('/auth/login', { username, password });

            if (res.data?.success) {

                const { token, user } = res.data;

                localStorage.setItem('token', token);

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setUser(user);

                return res.data;

            }

        } catch (error) {

            console.error("Login error:", error);

            throw error.response?.data?.message || "Login failed";

        }

    };


    const logout = () => {

        localStorage.removeItem('token');

        delete api.defaults.headers.common['Authorization'];

        setUser(null);

    };


    return (

        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);