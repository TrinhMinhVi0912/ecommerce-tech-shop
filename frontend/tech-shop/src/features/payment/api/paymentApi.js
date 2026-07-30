import axiosClient from "../../../services/axiosClient";

const paymentApi = {

    createVnPayPayment: (orderId) => {
        return axiosClient.post(`/payment/vnpay/${orderId}`);
    },

    vnPayReturn: (params) => {
        return axiosClient.get("/payment/vnpay/return", {
            params,
        });
    },

    vnPayIpn: (params) => {
        return axiosClient.get("/payment/vnpay/ipn", {
            params,
        });
    }

};

export default paymentApi;