// src/features/admin/banner/hooks/useUpdateBannerStatus.js
import { useState } from "react";
import bannerAdminApi from "../api/bannerAdminApi";

export default function useUpdateBannerStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateBannerStatus = async (bannerId, request) => {
        if (!bannerId) {
            throw new Error("Banner ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await bannerAdminApi.updateBannerStatus(bannerId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update banner status error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateBannerStatus,
        data,
        loading,
        error
    };
}