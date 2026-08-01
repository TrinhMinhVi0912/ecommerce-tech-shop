// src/features/admin/product/hooks/useCreateProduct.js
import { useState } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useCreateProduct() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = async (formData) => {
        if (!formData) {
            throw new Error("Form data is required");
        }

        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Calling createProduct API');

            const response = await adminProductApi.createProduct(formData);

            console.log('✅ Create product response:', response);

            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("❌ Create product error:", err);
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
        createProduct,
        data,
        loading,
        error
    };
}