import { useEffect, useState } from "react";
import productApi from "../api/productApi";

export default function useProductDetail(id) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!id) return;

        const fetchProduct = async () => {

            try {

                const response = await productApi.getById(id);

                setData(response.data);

            } catch (err) {

                console.error("Product Detail API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);

    return {
        data,
        loading,
        error
    };

}