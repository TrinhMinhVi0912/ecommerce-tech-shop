// src/features/admin/order/hooks/useAdminOrderDetail.js
import { useEffect, useState, useCallback } from "react";
import orderAdminApi from "../api/orderAdminApi";

export default function useAdminOrderDetail(orderId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetail = useCallback(async () => {
        if (!orderId) return;

        try {
            setLoading(true);
            setError(null);
            // API lấy chi tiết đơn hàng cho admin - cần thêm endpoint
            // Tạm thời dùng API của user, sau này sẽ tách riêng
            const response = await orderAdminApi.getOrderDetail(orderId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin order detail error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    const refetch = useCallback(() => {
        return fetchOrderDetail();
    }, [fetchOrderDetail]);

    return {
        data,
        loading,
        error,
        refetch
    };
}