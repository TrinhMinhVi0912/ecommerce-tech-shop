import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";

export default function useOrderDetail(orderId) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!orderId) return;

        const fetchOrderDetail = async () => {

            try {

                const response = await orderApi.getMyOrderDetail(orderId);

                setData(response.data);

            } catch (err) {

                console.error("Order Detail API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchOrderDetail();

    }, [orderId]);

    return {
        data,
        loading,
        error
    };

}