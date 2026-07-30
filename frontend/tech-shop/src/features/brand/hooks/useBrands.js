import { useEffect, useState } from "react";
import brandApi from "../api/brandApi";

export default function useBrands(params = {}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchBrands = async () => {

            try {

                const response = await brandApi.getAll(params);

                setData(response.data);

            } catch (err) {

                console.error("Brand API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchBrands();

    }, []);

    return {
        data,
        loading,
        error
    };

}



