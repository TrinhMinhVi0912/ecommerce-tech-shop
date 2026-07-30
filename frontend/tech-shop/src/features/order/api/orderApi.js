import axiosClient from "../../../services/axiosClient";

const orderApi = {

    getMyOrders: (params) => {
        return axiosClient.get("/orders", {
            params,
        });
    },

    getMyOrderDetail: (orderId) => {
        return axiosClient.get(`/orders/${orderId}`);
    },

    checkout: (data) => {
        return axiosClient.post("/orders/checkout", data);
    },

    cancelOrder: (orderId) => {
        return axiosClient.patch(`/orders/${orderId}/cancel`);
    }

};

export default orderApi;