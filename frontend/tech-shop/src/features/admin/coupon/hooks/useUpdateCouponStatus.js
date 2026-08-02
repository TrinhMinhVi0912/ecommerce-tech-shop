// src/features/admin/coupon/hooks/useUpdateCouponStatus.js
import { useState } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useUpdateCouponStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCouponStatus = async (couponId, request) => {
        if (!couponId) {
            throw new Error("Coupon ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.updateCouponStatus(couponId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update coupon status error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateCouponStatus,
        data,
        loading,
        error
    };
}