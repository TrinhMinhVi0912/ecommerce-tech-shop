import { useState } from "react";
import addressApi from "../api/addressApi";

export default function useUpdateAddress() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateAddress = async (addressId, request) => {

        try {

            setLoading(true);
            setError(null);

            const response = await addressApi.updateAddress(
                addressId,
                request
            );

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Update Address API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        updateAddress,
        data,
        loading,
        error
    };

}