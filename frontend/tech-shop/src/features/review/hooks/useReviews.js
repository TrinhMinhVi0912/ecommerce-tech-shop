import { useEffect, useState } from "react";
import reviewApi from "../api/reviewApi";

export default function useReviews(productId, params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await reviewApi.getReviews(productId, params);
                // Lấy dữ liệu từ response.data.data
                setData(response.data?.data || response.data);
            } catch (err) {
                console.error("Review API Error:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, params.pageNum, params.pageSize]);

    const refetch = async () => {
        if (!productId) return;
        try {
            setLoading(true);
            const response = await reviewApi.getReviews(productId, params);
            setData(response.data?.data || response.data);
        } catch (err) {
            console.error("Review API Error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch
    };
}