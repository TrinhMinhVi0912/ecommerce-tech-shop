import axiosClient from "../../../services/axiosClient";

const cartApi = {

    getMyCart: () => {
        return axiosClient.get("/cart");
    },

    addCartItem: (data) => {
        return axiosClient.post("/cart/items", data);
    },

    updateCartItem: (cartItemId, data) => {
        return axiosClient.put(`/cart/items/${cartItemId}`, data);
    },

    deleteCartItem: (cartItemId) => {
        return axiosClient.delete(`/cart/items/${cartItemId}`);
    }

};

export default cartApi;