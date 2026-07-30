import axiosClient from "../../../services/axiosClient";

const addressApi = {

    addAddress: (data) => {
        return axiosClient.post("/addresses", data);
    },

    updateAddress: (addressId, data) => {
        return axiosClient.put(`/addresses/${addressId}`, data);
    },

    deleteAddress: (addressId) => {
        return axiosClient.delete(`/addresses/${addressId}`);
    },

    setDefaultAddress: (addressId) => {
        return axiosClient.patch(`/addresses/${addressId}/default`);
    }

};

export default addressApi;