import { useState } from "react";
import authApi from "../api/authApi";
import { useAuth } from "../../../context/AuthContext";

export default function useLogout() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout: logoutAuthContext } = useAuth();

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            try {
                const response = await authApi.logout();
                setData(response.data);
            } catch (err) {
                console.warn("Logout API call failed or network issue:", err);
            }
        } finally {
            logoutAuthContext();
            setLoading(false);
        }
    };

    return {
        logout,
        data,
        loading,
        error
    };
}