// src/features/review/hooks/useDeleteReview.js
import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useDeleteReview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Đổi từ reviewId -> productId
    const deleteReview = async (productId) => {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        try {
            setLoading(true);
            setError(null);

            // ✅ DELETE /reviews/{productId}
            const response = await reviewApi.deleteReview(productId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
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