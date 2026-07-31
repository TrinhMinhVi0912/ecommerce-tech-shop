// src/features/cart/hooks/useUpdateCartItem.js
import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useUpdateCartItem() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCartItem = async (cartItemId, request) => {
        if (!cartItemId) {
            throw new Error('cartItemId is required');
        }

        if (!request || request.quantity === undefined) {
            throw new Error('Quantity is required');
        }

        console.log('🔄 useUpdateCartItem called:', { cartItemId, request });

        try {
            setLoading(true);
            setError(null);

            const response = await cartApi.updateCartItem(cartItemId, request);

            console.log('✅ Update cart response:', response.data);

            const responseData = response.data?.data || response.data;
            setData(responseData);

            return responseData;
        } catch (err) {
            console.error('❌ Update Cart Item API Error:', err);
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
        updateCartItem,
        data,
        loading,
        error
    };
}