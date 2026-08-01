// src/features/order/api/orderApi.js
import axiosClient from "../../../services/axiosClient";

const orderApi = {
    checkout: (data) => {
        return axiosClient.post("/orders/checkout", data);
    },

    getMyOrders: (params) => {
        return axiosClient.get("/orders", { params });
    },

    getOrderDetail: (orderId) => {
        return axiosClient.get(`/orders/${orderId}`);
    },

    cancelOrder: (orderId) => {
        return axiosClient.patch(`/orders/${orderId}/cancel`);
    }
};

export default orderApi;