import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useDeleteReview() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteReview = async (productId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await reviewApi.deleteReview(productId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Delete Review API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        deleteReview,
        data,
        loading,
        error
    };

}