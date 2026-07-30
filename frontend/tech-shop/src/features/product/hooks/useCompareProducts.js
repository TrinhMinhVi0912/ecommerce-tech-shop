import { useEffect, useState } from "react";
import productApi from "../api/productApi";

export default function useCompareProducts(productId1, productId2) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!productId1 || !productId2) {
            setLoading(false);
            return;
        }

        const compareProducts = async () => {

            try {

                const response = await productApi.compare(
                    productId1,
                    productId2
                );

                setData(response.data);

            } catch (err) {

                console.error("Compare Product API Error:", err);
                setError(err);

            } finally {

                setLoading(false);

            }

        };

        compareProducts();

    }, [productId1, productId2]);

    return {
        data,
        loading,
        error
    };

}