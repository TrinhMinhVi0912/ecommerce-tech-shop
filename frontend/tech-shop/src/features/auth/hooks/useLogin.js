import { useState } from "react";
import authApi from "../api/authApi";

export default function useLogin() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (loginRequest) => {

        try {

            setLoading(true);
            setError(null);

            const response = await authApi.login(loginRequest);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Login API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        login,
        data,
        loading,
        error
    };

}