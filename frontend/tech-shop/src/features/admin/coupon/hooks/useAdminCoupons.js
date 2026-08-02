// src/features/admin/coupon/hooks/useAdminCoupons.js
import { useEffect, useState, useCallback } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useAdminCoupons(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCoupons = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.getCoupons(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin coupons error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const refetch = useCallback(() => {
        return fetchCoupons();
    }, [fetchCoupons]);

    return {
        data,
        loading,
        error,
        refetch
    };
}