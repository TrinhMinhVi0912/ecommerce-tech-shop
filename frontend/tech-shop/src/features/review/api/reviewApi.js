// src/features/review/api/reviewApi.js
import axiosClient from "../../../services/axiosClient";

const reviewApi = {

    // ✅ GET /reviews/{productId}
    getReviews: (productId, params) => {
        return axiosClient.get(`/reviews/${productId}`, {
            params,
        });
    },

    // ✅ POST /reviews/{productId}
    addReview: (productId, data) => {
        return axiosClient.post(`/reviews/${productId}`, data);
    },

    // ✅ PUT /reviews/{productId}
    updateReview: (productId, data) => {
        return axiosClient.put(`/reviews/${productId}`, data);
    },

    // ✅ DELETE /reviews/{productId}
    deleteReview: (productId) => {
        return axiosClient.delete(`/reviews/${productId}`);
    }

};

export default reviewApi;