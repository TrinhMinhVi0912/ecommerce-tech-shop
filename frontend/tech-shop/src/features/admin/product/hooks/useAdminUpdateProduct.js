// src/features/admin/products/hooks/useUpdateProduct.js
import { useState } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useUpdateProduct() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProduct = async (productId, formData) => {
        console.log("Vào hooks update");

        if (!productId) {
            throw new Error("Product ID is required");
        }

        if (!formData) {
            throw new Error("Form data is required");
        }

        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Calling updateProduct API with:', {
                productId,
                formData
            });

            const response = await adminProductApi.updateProduct(productId, formData);

            console.log('✅ Update product response:', response);

            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("❌ Update product error:", err);
            console.error("Error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProduct,
        data,
        loading,
        error
    };
}