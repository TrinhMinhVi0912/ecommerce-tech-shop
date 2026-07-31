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

        console.log('🔍 [AuthContext] Checking auth...', { token: token ? 'exists' : 'null' });

        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return false;
        }

        try {
            const introspectResponse = await authApi.introspect();
            console.log('🔍 [AuthContext] Introspect response:', introspectResponse.data);

            if (introspectResponse.data?.success) {
                try {
                    const userResponse = await authApi.getCurrentUser();
                    console.log('🔍 [AuthContext] User response:', userResponse.data);

                    if (userResponse.data?.success) {
                        const userData = userResponse.data?.data;

                        if (userData && !userData.role) {
                            const role = userData.authorities?.[0]?.authority || 'USER';
                            userData.role = role.startsWith('ROLE_') ? role.substring(5) : role;
                        }

                        setUser(userData);
                        setIsAuthenticated(true);
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('🔍 [AuthContext] User set:', userData);
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
        console.log('🔍 [AuthContext] Login success:', { token, userData });

        if (userData && !userData.role) {
            const role = userData.authorities?.[0]?.authority || 'USER';
            userData.role = role.startsWith('ROLE_') ? role.substring(5) : role;
        }

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // ✅ Thêm phương thức cập nhật user (dùng sau khi upload avatar hoặc update profile)
    const updateUser = (userData) => {
        console.log('🔍 [AuthContext] Updating user:', userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    // ✅ Thêm phương thức refresh user từ API
    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const userResponse = await authApi.getCurrentUser();
            if (userResponse.data?.success) {
                const userData = userResponse.data?.data;
                if (userData) {
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setIsAuthenticated(true);
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
        console.log('🔍 [AuthContext] Logout');
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
        updateUser,    // ✅ Thêm vào context
        refreshUser,   // ✅ Thêm vào context
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};