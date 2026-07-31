import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useDeleteReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteReview = async (reviewId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reviewApi.deleteReview(reviewId);
            return response.data;
        } catch (err) {
            console.error("Delete Review API Error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteReview, loading, error };
}