import { useEffect, useState, useCallback } from "react";
import cartApi from "../api/cartApi";

export default function useCart() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartApi.getMyCart();
            setData(response.data);
        } catch (err) {
            console.error("Cart API Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return {
        data,
        loading,
        error,
        refetch: fetchCart
    };
}