// src/features/user/hooks/useUploadAvatar.js
import { useState } from "react";
import userApi from "../api/userApi";

export default function useUploadAvatar() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadAvatar = async (file) => {
        try {
            setLoading(true);
            setError(null);

            const response = await userApi.uploadAvatar(file);

            console.log('📤 Upload avatar response:', response.data);

            // ✅ Lấy data từ response (có thể là data hoặc data.data)
            const responseData = response.data?.data || response.data;

            // ✅ Cập nhật state với avatar URL mới
            setData(responseData);

            return responseData;
        } catch (err) {
            console.error("Upload Avatar API Error:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadAvatar,
        data,
        loading,
        error
    };
}