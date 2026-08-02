// src/features/admin/coupon/hooks/useCreateCoupon.js
import { useState } from "react";
import couponAdminApi from "../api/couponAdminApi";

export default function useCreateCoupon() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCoupon = async (request) => {
        try {
            setLoading(true);
            setError(null);
            const response = await couponAdminApi.createCoupon(request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Create coupon error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createCoupon,
        data,
        loading,
        error
    };
}