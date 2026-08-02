// src/features/admin/banner/hooks/useAdminBanners.js
import { useEffect, useState, useCallback } from "react";
import bannerAdminApi from "../api/bannerAdminApi";

export default function useAdminBanners(params = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bannerAdminApi.getBanners(params);
            const responseData = response.data?.data || response.data;
            setData(responseData);
        } catch (err) {
            console.error("Get admin banners error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const refetch = useCallback(() => {
        return fetchBanners();
    }, [fetchBanners]);

    return {
        data,
        loading,
        error,
        refetch
    };
}