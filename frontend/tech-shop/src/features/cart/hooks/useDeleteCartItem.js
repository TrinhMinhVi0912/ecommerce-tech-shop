import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useDeleteCartItem() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCartItem = async (cartItemId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await cartApi.deleteCartItem(cartItemId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Delete Cart Item API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        deleteCartItem,
        data,
        loading,
        error
    };

}