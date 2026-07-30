import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";

export default function useOrders(params = {}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await orderApi.getMyOrders(params);

                setData(response.data);

            } catch (err) {

                console.error("Order API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchOrders();

    }, []);

    return {
        data,
        loading,
        error
    };

}