import { useState } from "react";
import paymentApi from "../api/paymentApi";

export default function useCreateVnPayPayment() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createVnPayPayment = async (orderId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await paymentApi.createVnPayPayment(orderId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Create VNPAY Payment API Error:", err);
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