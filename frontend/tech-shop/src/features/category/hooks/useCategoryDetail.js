import { useEffect, useState } from "react";
import categoryApi from "../api/categoryApi";

export default function useCategoryDetail(id) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!id) return;

        const fetchCategory = async () => {

            try {

                const response = await categoryApi.getById(id);

                setData(response.data);

            } catch (err) {

                console.error("Category Detail API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchCategory();

    }, [id]);

    return {
        data,
        loading,
        error
    };

}