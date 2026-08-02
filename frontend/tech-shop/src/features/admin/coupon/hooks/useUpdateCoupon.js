// src/features/admin/coupon/hooks/useUpdateCoupon.js
import { useState } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useUpdateCoupon() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCoupon = async (couponId, request) => {
        if (!couponId) {
            throw new Error("Coupon ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.updateCoupon(couponId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update coupon error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateCoupon,
        data,
        loading,
        error
    };
}