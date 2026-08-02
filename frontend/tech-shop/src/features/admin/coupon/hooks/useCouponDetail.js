// src/features/admin/coupon/hooks/useCouponDetail.js
import { useEffect, useState, useCallback } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useCouponDetail(couponId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCouponDetail = useCallback(async () => {
        if (!couponId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.getCouponById(couponId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get coupon detail error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [couponId]);

    useEffect(() => {
        fetchCouponDetail();
    }, [fetchCouponDetail]);

    const refetch = useCallback(() => {
        return fetchCouponDetail();
    }, [fetchCouponDetail]);

    return {
        data,
        loading,
        error,
        refetch
    };
}