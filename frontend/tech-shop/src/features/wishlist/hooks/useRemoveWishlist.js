import { useState } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useRemoveWishlist() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeWishlist = async (productId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await wishlistApi.removeFromWishlist(productId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Remove Wishlist API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        removeWishlist,
        data,
        loading,
        error
    };

}