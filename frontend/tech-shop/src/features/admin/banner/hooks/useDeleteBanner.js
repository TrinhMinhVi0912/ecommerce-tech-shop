// src/features/admin/banner/hooks/useDeleteBanner.js
import { useState } from "react";
import bannerAdminApi from "../api/bannerAdminApi";

export default function useDeleteBanner() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteBanner = async (bannerId) => {
        if (!bannerId) {
            throw new Error("Banner ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await bannerAdminApi.deleteBanner(bannerId);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Delete banner error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteBanner,
        data,
        loading,
        error
    };
}