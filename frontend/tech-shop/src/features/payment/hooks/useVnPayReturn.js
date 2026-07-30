import { useState } from "react";
import paymentApi from "../api/paymentApi";

export default function useVnPayReturn() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const vnPayReturn = async (params) => {

        try {

            setLoading(true);
            setError(null);

            const response = await paymentApi.vnPayReturn(params);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("VNPAY Return API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        vnPayReturn,
        data,
        loading,
        error
    };

}