import { useState } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useAddWishlist() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addWishlist = async (productId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await wishlistApi.addToWishlist(productId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Add Wishlist API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        addWishlist,
        data,
        loading,
        error
    };

}