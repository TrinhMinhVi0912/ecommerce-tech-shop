import { useState } from "react";
import userApi from "../api/userApi";

export default function useChangePassword() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const changePassword = async (request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await userApi.changePassword(request);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Change Password API Error:", err);

            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        changePassword,
        data,
        loading,
        error
    };

}