import { useState } from "react";
import authApi from "../api/authApi";

export default function useLogout() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = async () => {

        try {

            setLoading(true);
            setError(null);

            const response = await authApi.logout();

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Logout API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        logout,
        data,
        loading,
        error
    };

}