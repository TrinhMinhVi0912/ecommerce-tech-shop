// src/features/payment/hooks/useCreateVnPayPayment.js
import { useState } from "react";
import paymentApi from "../api/paymentApi";

export default function useCreateVnPayPayment() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createVnPayPayment = async (orderId) => {
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Creating VNPay payment for order:', orderId);

            const response = await paymentApi.createVnPayPayment(orderId);

            console.log('📥 Raw response:', response);

            const responseData = response.data?.data || response.data;
            const paymentUrl = responseData?.paymentUrl || responseData?.data?.paymentUrl;

            console.log('📥 Extracted paymentUrl:', paymentUrl);

            if (!paymentUrl) {
                throw new Error('Không nhận được paymentUrl từ server');
            }

            const result = {
                success: response.data?.success !== undefined ? response.data.success : true,
                paymentUrl: paymentUrl,
                message: response.data?.message || 'Create VNPay payment successfully'
            };

            setData(result);
            return result;

        } catch (err) {
            console.error("❌ Create VNPAY Payment API Error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createVnPayPayment,
        data,
        loading,
        error
    };
}