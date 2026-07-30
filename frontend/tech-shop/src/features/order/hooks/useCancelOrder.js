import { useState } from "react";
import orderApi from "../api/orderApi";

export default function useCancelOrder() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cancelOrder = async (orderId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await orderApi.cancelOrder(orderId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Cancel Order API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        cancelOrder,
        data,
        loading,
        error
    };

}