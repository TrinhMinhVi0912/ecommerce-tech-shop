import { useState } from "react";
import addressApi from "../api/addressApi";

export default function useDeleteAddress() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteAddress = async (addressId) => {

        try {

            setLoading(true);
            setError(null);

            const response = await addressApi.deleteAddress(addressId);

            setData(response.data);

            return response.data;

        } catch (err) {

            console.error("Delete Address API Error:", err);
            setError(err);

            throw err;

        } finally {

            setLoading(false);

        }

    };

    return {
        deleteAddress,
        data,
        loading,
        error
    };

}