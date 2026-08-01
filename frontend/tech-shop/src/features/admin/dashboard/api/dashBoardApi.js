// src/features/admin/api/adminApi.js
import axiosClient from "@/services/axiosClient";

const dashboardApi = {

    // Dashboard
    getSummary: () => {
        return axiosClient.get("/admin/dashboard/summary");
    },

    getRevenue: (params) => {
        return axiosClient.get("/admin/dashboard/revenue", { params });
    },

    getOrderStatistics: (params) => {
        return axiosClient.get("/admin/dashboard/orders", { params });
    },

    getTopProducts: (params) => {
        return axiosClient.get("/admin/dashboard/top-products", { params });
    }

};

export default dashboardApi;