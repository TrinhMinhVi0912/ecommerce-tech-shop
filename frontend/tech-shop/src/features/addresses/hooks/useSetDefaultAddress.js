import { useState } from "react";
import addressApi from "../api/addressApi";

export default function useSetDefaultAddress() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setDefaultAddress = async (addressId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await addressApi.setDefaultAddress(addressId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Set Default Address API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        setDefaultAddress,
        data,
        loading,
        error
    };

}