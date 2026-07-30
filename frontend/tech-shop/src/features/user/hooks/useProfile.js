import { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function useProfile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await userApi.getProfile();

                setData(response.data);

            } catch (err) {

                console.error("Get Profile API Error:", err);

                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    return {
        data,
        loading,
        error
    };

}