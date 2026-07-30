import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useAddReview() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addReview = async (productId, request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await reviewApi.addReview(
                productId,
                request
            );

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Add Review API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        addReview,
        data,
        loading,
        error
    };

}