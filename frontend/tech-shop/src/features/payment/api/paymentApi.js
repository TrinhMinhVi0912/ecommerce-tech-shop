// src/features/payment/api/paymentApi.js
import axiosClient from "../../../services/axiosClient";

const paymentApi = {

    createVnPayPayment: (orderId) => {
        console.log('📤 API call: POST /payment/vnpay/' + orderId);
        return axiosClient.post(`/payment/vnpay/${orderId}`);
    },

    vnPayReturn: (params) => {
        console.log('📤 API call: GET /payment/vnpay/return with params:', params);
        return axiosClient.get("/payment/vnpay/return", {
            params,
        });
    },

    vnPayIpn: (params) => {
        console.log('📤 API call: GET /payment/vnpay/ipn with params:', params);
        return axiosClient.get("/payment/vnpay/ipn", {
            params,
        });
    }

};

export default paymentApi;