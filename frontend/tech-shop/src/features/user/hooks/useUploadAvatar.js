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

            setData(response.data);

            return response.data;

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