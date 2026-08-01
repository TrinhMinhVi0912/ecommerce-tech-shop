// src/features/order/hooks/useOrderDetail.js
import { useEffect, useState, useCallback } from "react";
import orderApi from "../api/orderApi";

export default function useOrderDetail(orderId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetail = useCallback(async () => {
        if (!orderId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await orderApi.getOrderDetail(orderId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get order detail error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    return {
        data,
        loading,
        error,
        refetch: fetchOrderDetail
    };
}