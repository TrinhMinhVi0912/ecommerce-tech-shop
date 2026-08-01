// src/features/admin/products/hooks/useAdminProducts.js
import { useEffect, useState, useCallback } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useAdminProducts(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminProductApi.getProducts(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin products error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const refetch = useCallback(() => {
        return fetchProducts();
    }, [fetchProducts]);

    return {
        data,
        loading,
        error,
        refetch
    };
}