// src/features/admin/order/hooks/useUpdateOrderStatus.js
import { useState } from "react";
import orderAdminApi from "../api/orderAdminApi";

export default function useUpdateOrderStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrderStatus = async (orderId, request) => {
        if (!orderId) {
            throw new Error("Order ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await orderAdminApi.updateOrderStatus(orderId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update order status error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateOrderStatus,
        data,
        loading,
        error
    };
}