// src/features/admin/banner/hooks/useCreateBanner.js
import { useState } from "react";
import bannerAdminApi from "../api/bannerAdminApi";

export default function useCreateBanner() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBanner = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await bannerAdminApi.createBanner(formData);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Create banner error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createBanner,
        data,
        loading,
        error
    };
}