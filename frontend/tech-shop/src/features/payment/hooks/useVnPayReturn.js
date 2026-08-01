// src/features/payment/hooks/useVnPayReturn.js
import { useState, useRef } from "react";
import paymentApi from "../api/paymentApi";

export default function useVnPayReturn() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFetching = useRef(false);

    const vnPayReturn = async (params) => {
        // ✅ Nếu đang fetch thì không gọi nữa
        if (isFetching.current) {
            console.log('⏭️ Already fetching, skipping...');
            return data;
        }

        try {
            isFetching.current = true;
            setLoading(true);
            setError(null);

            console.log('📤 Calling VNPay return API with params:', params);

            const response = await paymentApi.vnPayReturn(params);

            // Lấy data từ response
            const responseData = response.data?.data || response.data;
            console.log('📥 VNPay return response:', responseData);

            setData(responseData);
            setLoading(false);
            return responseData;
        } catch (err) {
            console.error("❌ VNPAY Return API Error:", err);
            setError(err);
            setLoading(false);
            throw err;
        } finally {
            isFetching.current = false;
        }
    };

    return {
        vnPayReturn,
        data,
        loading,
        error
    };
}