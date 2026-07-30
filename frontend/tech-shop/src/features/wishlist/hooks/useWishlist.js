import { useEffect, useState } from "react";
import wishlistApi from "../api/wishlistApi";

export default function useWishlist(params = {}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchWishlist = async () => {

            try {

                const response = await wishlistApi.getMyWishlist(params);

                setData(response.data);

            } catch (err) {

                console.error("Wishlist API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchWishlist();

    }, []);

    return {
        data,
        loading,
        error
    };

}