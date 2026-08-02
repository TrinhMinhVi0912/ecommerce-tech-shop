// src/features/admin/user/hooks/useUpdateUserStatus.js
import { useState } from "react";
import userAdminApi from "../api/userAdminApi";

export default function useUpdateUserStatus() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUserStatus = async (userId, request) => {
        if (!userId) {
            throw new Error("User ID is required");
        }

        try {
            setLoading(true);
            setError(null);
            const response = await userAdminApi.updateUserStatus(userId, request);
            const responseData = response.data?.data || response.data;
            setData(responseData);
            return responseData;
        } catch (err) {
            console.error("Update user status error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserStatus,
        data,
        loading,
        error
    };
}