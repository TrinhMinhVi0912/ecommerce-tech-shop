// src/features/admin/banner/api/bannerAdminApi.js
import axiosClient from "@/services/axiosClient";

const bannerAdminApi = {

    getBanners: (params) => {
        return axiosClient.get("/admin/banners", { params });
    },

    createBanner: (data) => {
        return axiosClient.post("/admin/banners", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateBannerStatus: (bannerId, data) => {
        return axiosClient.patch(`/admin/banners/${bannerId}/active`, data);
    },

    deleteBanner: (bannerId) => {
        return axiosClient.delete(`/admin/banners/${bannerId}`);
    }

};

export default bannerAdminApi;