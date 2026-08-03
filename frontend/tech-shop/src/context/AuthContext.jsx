// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '@/features/auth/api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return false;
        }

        try {
            const introspectResponse = await authApi.introspect();

            if (introspectResponse.data?.success) {
                try {
                    const userResponse = await authApi.getCurrentUser();
                    if (userResponse.data?.success) {
                        const userData = userResponse.data?.data;

                        if (userData && !userData.role) {
                            const role = userData.authorities?.[0]?.authority || 'USER';
                            userData.role = role.startsWith('ROLE_') ? role.substring(5) : role;
                        }

                        setUser(userData);
                        setIsAuthenticated(true);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('user');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Get user info error:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const loginSuccess = (token, userData) => {
        if (userData && !userData.role) {
            const role = userData.authorities?.[0]?.authority || 'USER';
            userData.role = role.startsWith('ROLE_') ? role.substring(5) : role;
        }

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const updateUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return null;

            const userResponse = await authApi.getCurrentUser();
            console.log('🔄 Refresh user response:', userResponse.data);

            if (userResponse.data?.success) {
                const userData = userResponse.data?.data;
                if (userData) {
                    // ✅ Cập nhật user với avatar mới
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ User refreshed with new avatar:', userData.avatarUrl);
                    return userData;
                }
            }
            return null;
        } catch (error) {
            console.error('Refresh user error:', error);
            return null;
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const value = {
        user,
        isAuthenticated,
        loading,
        loginSuccess,
        logout,
        updateUser,
        refreshUser,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};