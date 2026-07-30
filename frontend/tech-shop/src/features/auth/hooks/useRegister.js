import { useState } from "react";
import authApi from "../api/authApi";

export default function useRegister() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (registerRequest) => {

        try {

            setLoading(true);
            setError(null);

            const response = await authApi.register(registerRequest);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Register API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        register,
        data,
        loading,
        error
    };

}