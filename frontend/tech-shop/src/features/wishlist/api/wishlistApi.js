import axiosClient from "../../../services/axiosClient";

const wishlistApi = {

    getMyWishlist: (params) => {
        return axiosClient.get("/wishlist", {
            params,
        });
    },

    addToWishlist: (productId) => {
        return axiosClient.post(`/wishlist/${productId}`);
    },

    removeFromWishlist: (productId) => {
        return axiosClient.delete(`/wishlist/${productId}`);
    }

};

export default wishlistApi;