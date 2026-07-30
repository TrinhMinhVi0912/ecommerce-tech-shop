import { useEffect, useState } from "react";
import brandApi from "../api/brandApi";


export default function useBrandDetail(id) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!id) return;

        const fetchBrand = async () => {

            try {

                const response = await brandApi.getById(id);

                setData(response.data);

            } catch (err) {

                console.error("Brand Detail API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchBrand();

    }, [id]);

    return {
        data,
        loading,
        error
    };

}