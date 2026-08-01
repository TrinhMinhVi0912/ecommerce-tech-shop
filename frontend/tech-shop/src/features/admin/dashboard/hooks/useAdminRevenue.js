// src/features/admin/hooks/useAdminRevenue.js
import { useEffect, useState, useCallback } from "react";
import adminApi from "../api/dashBoardApi";

export default function useAdminRevenue(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRevenue = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminApi.getRevenue(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get revenue error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params.type, params.year]);

    useEffect(() => {
        fetchRevenue();
    }, [fetchRevenue]);

    return {
        data,
        loading,
        error,
        refetch: fetchRevenue
    };
}