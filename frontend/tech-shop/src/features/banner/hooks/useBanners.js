import { useEffect, useState } from "react";
import bannerApi from "../api/bannerApi";

export default function useBanners() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchBanners = async () => {

            try {

                const response = await bannerApi.getActive();
                // response.data = { success, message, data: { items: [...] } }
                setData(response.data);

            } catch (err) {

                console.error("Banner API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchBanners();

    }, []);

    return {
        data,
        loading,
        error
    };

}