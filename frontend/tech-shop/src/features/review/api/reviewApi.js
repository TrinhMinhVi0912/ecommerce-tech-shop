import axiosClient from "../../../services/axiosClient";

const reviewApi = {

    getReviews: (productId, params) => {
        return axiosClient.get(`/products/${productId}/reviews`, {
            params,
        });
    },

    addReview: (productId, data) => {
        return axiosClient.post(
            `/products/${productId}/reviews`,
            data
        );
    },

    updateReview: (productId, data) => {
        return axiosClient.put(
            `/products/${productId}/reviews`,
            data
        );
    },

    deleteReview: (productId) => {
        return axiosClient.delete(
            `/products/${productId}/reviews`
        );
    }

};

export default reviewApi;