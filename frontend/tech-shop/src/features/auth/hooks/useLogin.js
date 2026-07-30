import { useState } from "react";
import authApi from "../api/authApi";

export default function useLogin() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (request) => {
        try {

            const response = await authApi.login(request);

            localStorage.setItem("accessToken", response.data.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    userName: response.data.data.userName,
                    email: response.data.data.email,
                    role: response.data.data.role,
                })
            );

            return true;

        } catch (err) {

            setError(err);

            return false;

        }
    };

    return {
        login,
        data,
        loading,
        error
    };

}