import { useState } from "react";
import paymentApi from "../api/paymentApi";


// hàm này sẽ ko được gọi
// export default function useVnPayIpn() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const vnPayIpn = async (params) => {

//         try {

//             setLoading(true);
//             setError(null);

//             const response = await paymentApi.vnPayIpn(params);

//             setData(response.data);

//             return response.data;

//         } catch (err) {

//             console.error("VNPAY IPN API Error:", err);
//             setError(err);

//             throw err;

//         } finally {

//             setLoading(false);

//         }

//     };

//     return {
//         vnPayIpn,
//         data,
//         loading,
//         error
//     };

// }