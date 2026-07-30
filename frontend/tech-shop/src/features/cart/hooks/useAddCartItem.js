import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useAddCartItem() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addCartItem = async (request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await cartApi.addCartItem(request);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Add Cart Item API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        addCartItem,
        data,
        loading,
        error
    };

}