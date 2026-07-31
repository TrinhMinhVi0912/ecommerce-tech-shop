// src/features/cart/hooks/useAddCartItem.js
import { useState } from "react";
import cartApi from "../api/cartApi";

export default function useAddCartItem() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = async (request) => {
        try {
            setLoading(true);
            setError(null);

            const response = await cartApi.addCartItem(request);

            // Lấy dữ liệu từ response
            const responseData = response.data?.data || response.data;
            setData(responseData);

            return responseData;
        } catch (err) {
            console.error("Add Cart Item API Error:", err);
            setError(err);
            throw err; // Ném lỗi để component xử lý
        } finally {
            setLoading(false);
        }
    };

    return {
        addToCart,
        data,
        loading,
        error
    };
}