// src/features/user/hooks/useProfile.js
import { useEffect, useState, useCallback } from "react";
import userApi from "../api/userApi";

export default function useProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await userApi.getProfile();
            setData(response.data);
        } catch (err) {
            console.error("Get Profile API Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const refetch = () => {
        return fetchProfile();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
}