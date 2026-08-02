// src/features/admin/order/hooks/useAdminOrders.js
import { useEffect, useState, useCallback } from "react";
import orderAdminApi from "../api/orderAdminApi";

export default function useAdminOrders(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderAdminApi.getOrders(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin orders error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const refetch = useCallback(() => {
        return fetchOrders();
    }, [fetchOrders]);

    return {
        data,
        loading,
        error,
        refetch
    };
}