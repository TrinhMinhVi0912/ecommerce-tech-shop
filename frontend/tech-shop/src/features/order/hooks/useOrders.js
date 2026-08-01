// src/features/order/hooks/useOrders.js
import { useEffect, useState, useCallback } from "react";
import orderApi from "../api/orderApi";

export default function useOrders(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📤 Fetching orders with params:', params);

            const response = await orderApi.getMyOrders(params);

            console.log('📥 Raw response:', response);

            const responseData = response.data?.data || response.data;

            console.log('📥 Orders response data:', responseData);

            setData(responseData);
            setLoading(false);
        } catch (err) {
            console.error("❌ Get orders error:", err);
            setError(err);
            setLoading(false);
        }
    }, [params.pageNum, params.pageSize, params.status]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const refetch = useCallback(() => {
        setLoading(true);
        fetchOrders();
    }, [fetchOrders]);

    return {
        data,
        loading,
        error,
        refetch
    };
}