// src/features/admin/order/hooks/useAdminPendingOrders.js
import { useEffect, useState, useCallback } from "react";
import orderAdminApi from "../api/orderAdminApi";

export default function useAdminPendingOrders() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderAdminApi.getOrders({
                status: 'PENDING',
                pageNum: 1,
                pageSize: 100 // Lấy tất cả đơn hàng chờ xác nhận
            });
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get pending orders error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingOrders();
    }, [fetchPendingOrders]);

    const refetch = useCallback(() => {
        return fetchPendingOrders();
    }, [fetchPendingOrders]);

    return {
        data,
        loading,
        error,
        refetch
    };
}