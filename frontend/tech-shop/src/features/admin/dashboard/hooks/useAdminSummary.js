// src/features/admin/dashboard/hooks/useAdminRevenue.js

import { useEffect, useState, useCallback } from "react";
import adminApi from "../api/dashBoardApi";

export default function useAdminSummary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getSummary();
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get dashboard summary error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        data,
        loading,
        error,
        refetch: fetchSummary
    };
}