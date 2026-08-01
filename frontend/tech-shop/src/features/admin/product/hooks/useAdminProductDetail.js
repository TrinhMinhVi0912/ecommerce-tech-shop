// src/features/admin/products/hooks/useAdminProductDetail.js
import { useEffect, useState, useCallback } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useAdminProductDetail(productId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductDetail = useCallback(async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await adminProductApi.getProductById(productId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin product detail error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductDetail();
    }, [fetchProductDetail]);

    const refetch = useCallback(() => {
        return fetchProductDetail();
    }, [fetchProductDetail]);

    return {
        data,
        loading,
        error,
        refetch
    };
}