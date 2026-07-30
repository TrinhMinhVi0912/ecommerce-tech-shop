import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useUpdateCartItem() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCartItem = async (cartItemId, request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await cartApi.updateCartItem(cartItemId, request);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Update Cart Item API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        updateCartItem,
        data,
        loading,
        error
    };

}