// src/features/cart/hooks/useDeleteCartItem.js
import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useDeleteCartItem() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCartItem = async (cartItemId) => {
        if (!cartItemId) {
            throw new Error('cartItemId is required');
        }

        console.log('🗑️ useDeleteCartItem called:', { cartItemId });

        try {
            setLoading(true);
            setError(null);

            const response = await cartApi.deleteCartItem(cartItemId);
            console.log('✅ Delete response:', response.data);

            const responseData = response.data?.data || response.data;
            setData(responseData);

            return responseData;
        } catch (err) {
            console.error('❌ Delete Cart Item API Error:', err);
            console.error('Error details:', {
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
        deleteCartItem,
        data,
        loading,
        error
    };
}