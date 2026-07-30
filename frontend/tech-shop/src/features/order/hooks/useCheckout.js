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

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Checkout API Error:", err);
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