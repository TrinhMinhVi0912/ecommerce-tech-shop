// src/features/order/hooks/useCheckout.js
import { useState } from "react";
import orderApi from "../api/orderApi";

export default function useCheckout() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkout = async (request) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderApi.checkout(request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Checkout error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        checkout,
        data,
        loading,
        error
    };
}