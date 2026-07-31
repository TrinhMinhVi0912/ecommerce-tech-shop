// src/features/auth/hooks/useLogin.js
import { useState } from "react";
import authApi from "../api/authApi";
import { useAuth } from "../../../context/AuthContext";

export default function useLogin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { loginSuccess, refreshUser } = useAuth();

    const login = async (request) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authApi.login(request);

            console.log('📝 Login response:', response.data);

            const responseData = response.data?.data || response.data;

            const authToken = responseData?.token || responseData?.accessToken;

            const userData = {
                userId: responseData?.userId || responseData?.id,
                userName: responseData?.userName || responseData?.username,
                email: responseData?.email,
                fullName: responseData?.fullName || responseData?.fullname,
                phone: responseData?.phone,
                role: responseData?.role,
                avatarUrl: responseData?.avatarUrl || responseData?.avatar,
                isActive: responseData?.isActive !== undefined ? responseData.isActive : true
            };

            console.log('🔑 Token:', authToken);
            console.log('👤 User data:', userData);

            if (authToken) {
                // ✅ Login success sẽ set user vào context
                loginSuccess(authToken, userData);

                // ✅ Gọi refresh để đảm bảo lấy được avatar mới nhất
                await refreshUser();

                setData(responseData);
                return { success: true, data: responseData };
            }
            return { success: false, message: "No token received" };
        } catch (err) {
            console.error("Login API Error:", err);
            setError(err.response?.data?.message || err.message || "Login failed");
            return { success: false, message: err.response?.data?.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        data,
        loading,
        error
    };
}