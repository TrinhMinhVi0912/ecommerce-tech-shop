// src/features/admin/user/hooks/useAdminUsers.js
import { useEffect, useState, useCallback } from "react";
import userAdminApi from "../api/userAdminApi";

export default function useAdminUsers(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userAdminApi.getUsers(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin users error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const refetch = useCallback(() => {
        return fetchUsers();
    }, [fetchUsers]);

    return {
        data,
        loading,
        error,
        refetch
    };
}