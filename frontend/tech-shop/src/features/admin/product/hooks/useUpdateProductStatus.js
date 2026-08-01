// src/features/admin/products/hooks/useUpdateProductStatus.js
import { useState } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useUpdateProductStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProductStatus = async (productId, request) => {
        if (!productId) {
            throw new Error("Product ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await adminProductApi.updateProductStatus(productId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update product status error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProductStatus,
        data,
        loading,
        error
    };
}