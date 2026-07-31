import { useState } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useRemoveFromWishlist() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const removeFromWishlist = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await wishlistApi.removeFromWishlist(productId);
            const responseData = response.data || response;

            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Remove from wishlist error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        removeFromWishlist,
        loading,
        error,
        data
    };
}