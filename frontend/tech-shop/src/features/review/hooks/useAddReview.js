// src/features/review/hooks/useAddReview.js
import { useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useAddReview() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addReview = async (productId, request) => {
        if (!productId) {
            throw new Error('Product ID is required');
        }

        if (!request.rating || request.rating < 1 || request.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        if (!request.comment || request.comment.trim().length < 3) {
            throw new Error('Comment must be at least 3 characters');
        }

        try {
            setLoading(true);
            setError(null);

            console.log('📤 Sending review:', {
                productId,
                rating: Number(request.rating),
                comment: request.comment.trim()
            });

            // ✅ POST /reviews/{productId}
            const response = await reviewApi.addReview(productId, {
                rating: Number(request.rating),
                comment: request.comment.trim()
            });

            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
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