import { useState } from "react";
import addressApi from "../api/addressApi";

export default function useAddAddress() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addAddress = async (request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await addressApi.addAddress(request);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Add Address API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        addAddress,
        data,
        loading,
        error
    };

}