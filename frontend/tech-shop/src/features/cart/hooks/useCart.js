import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";

export default function useCart() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const response = await cartApi.getMyCart();

                setData(response.data);

            } catch (err) {

                console.error("Cart API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchCart();

    }, []);

    return {
        data,
        loading,
        error
    };

}