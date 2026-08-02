// src/features/admin/coupon/api/couponAdminApi.js
import axiosClient from "@/services/axiosClient";

const couponAdminApi = {

    getCoupons: (params) => {
        return axiosClient.get("/admin/coupons", { params });
    },

    getCouponById: (id) => {
        return axiosClient.get(`/admin/coupons/${id}`);
    },

    createCoupon: (data) => {
        return axiosClient.post("/admin/coupons", data);
    },

    updateCoupon: (id, data) => {
        return axiosClient.put(`/admin/coupons/${id}`, data);
    },

    updateCouponStatus: (id, data) => {
        return axiosClient.patch(`/admin/coupons/${id}/status`, data);
    },

    getCouponUsages: (id, params) => {
        return axiosClient.get(`/admin/coupons/${id}/usages`, { params });
    }

};

export default couponAdminApi;