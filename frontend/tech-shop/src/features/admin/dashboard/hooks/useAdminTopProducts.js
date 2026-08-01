// src/features/admin/dashboard/hooks/useAdminRevenue.js

import { useEffect, useState, useCallback } from "react";
import adminApi from "../api/dashBoardApi";

export default function useAdminTopProducts(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTopProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getTopProducts(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get top products error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params.type, params.year, params.month, params.quarter]);

    useEffect(() => {
        fetchTopProducts();
    }, [fetchTopProducts]);

    return {
        data,
        loading,
        error,
        refetch: fetchTopProducts
    };
}