// src/features/cart/api/cartApi.js
import axiosClient from "../../../services/axiosClient";

const cartApi = {

    getMyCart: () => {
        return axiosClient.get("/cart");
    },

    addCartItem: (data) => {
        if (!data.variantId) {
            throw new Error('variantId is required');
        }
        if (!data.quantity || data.quantity < 1) {
            throw new Error('quantity must be at least 1');
        }
        return axiosClient.post("/cart/items", data);
    },

    updateCartItem: (cartItemId, data) => {
        if (!cartItemId) {
            throw new Error('cartItemId is required');
        }
        if (data.quantity === undefined || data.quantity < 0) {
            throw new Error('quantity must be at least 0');
        }
        console.log('📦 API Update cart item:', { cartItemId, data });
        return axiosClient.put(`/cart/items/${cartItemId}`, data);
    },

    deleteCartItem: (cartItemId) => {
        if (!cartItemId) {
            throw new Error('cartItemId is required');
        }
        console.log('🗑️ API Delete cart item:', { cartItemId });
        return axiosClient.delete(`/cart/items/${cartItemId}`);
    }

};

export default cartApi;