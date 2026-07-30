import { useState } from "react";
import userApi from "../api/userApi";

export default function useUpdateProfile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProfile = async (request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await userApi.updateProfile(request);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Update Profile API Error:", err);

            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        updateProfile,
        data,
        loading,
        error
    };

}