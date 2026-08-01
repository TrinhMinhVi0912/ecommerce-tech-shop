// src/features/review/hooks/useUpdateReview.js
import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useUpdateReview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Bỏ reviewId, chỉ cần productId
    const updateReview = async (productId, request) => {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        try {
            setLoading(true);
            setError(null);

            // ✅ PUT /reviews/{productId}
            const response = await reviewApi.updateReview(productId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
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