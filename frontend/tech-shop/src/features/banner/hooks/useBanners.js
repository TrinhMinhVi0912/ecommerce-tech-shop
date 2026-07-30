import { useEffect, useState } from "react";
import bannerApi from "../api/bannerApi";

export default function useBanners() {

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchBanners = async () => {

            try {

                const response = await bannerApi.getActive();

                setBanners(response.data);

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
        banners,
        loading,
        error
    };

}