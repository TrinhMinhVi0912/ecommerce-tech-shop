import { useState } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useAddToWishlist() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const addToWishlist = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await wishlistApi.addToWishlist(productId);
            const responseData = response.data || response;

            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Add to wishlist error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        addToWishlist,
        loading,
        error,
        data
    };
}