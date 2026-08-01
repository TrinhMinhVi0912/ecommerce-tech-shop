// src/features/admin/product/hooks/useDeleteProduct.js
import { useState } from "react";
import adminProductApi from "../api/adminProductApi";

export default function useDeleteProduct() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProduct = async (productId) => {
        if (!productId) {
            throw new Error("Product ID is required");
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`🗑️ [API] Deleting product ID: ${productId}`);

            const response = await adminProductApi.deleteProduct(productId);

            console.log('✅ Delete product response:', response);

            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("❌ Delete product error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteProduct,
        data,
        loading,
        error
    };
}