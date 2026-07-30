import { useEffect, useState } from "react";
import productApi from "../api/productApi";

export default function useProducts(params = {}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await productApi.getAll(params);

                setData(response.data);

            } catch (err) {

                console.error("Product API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        fetchProducts();

    }, []);

    return {
        data,
        loading,
        error
    };

}