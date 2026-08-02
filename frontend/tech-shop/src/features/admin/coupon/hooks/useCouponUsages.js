// src/features/admin/coupon/hooks/useCouponUsages.js
import { useEffect, useState, useCallback } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useCouponUsages(couponId, params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsages = useCallback(async () => {
        if (!couponId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.getCouponUsages(couponId, params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get coupon usages error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [couponId, params]);

    useEffect(() => {
        fetchUsages();
    }, [fetchUsages]);

    const refetch = useCallback(() => {
        return fetchUsages();
    }, [fetchUsages]);

    return {
        data,
        loading,
        error,
        refetch
    };
}