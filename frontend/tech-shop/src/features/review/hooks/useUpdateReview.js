import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useUpdateReview() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateReview = async (productId, request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await reviewApi.updateReview(
                productId,
                request
            );

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Update Review API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        updateReview,
        data,
        loading,
        error
    };

}