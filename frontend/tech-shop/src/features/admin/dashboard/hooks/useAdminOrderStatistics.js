// src/features/admin/dashboard/hooks/useAdminRevenue.js

import { useEffect, useState, useCallback } from "react";
import adminApi from "../api/dashBoardApi";

export default function useAdminOrderStatistics(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getOrderStatistics(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get order statistics error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params.type, params.year]);

    useEffect(() => {
        fetchOrderStatistics();
    }, [fetchOrderStatistics]);

    return {
        data,
        loading,
        error,
        refetch: fetchOrderStatistics
    };
}