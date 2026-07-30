import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,

    headers: {
        "Content-Type": "application/json",
    },
});

// console.log(import.meta.env.VITE_API_URL);

axiosClient.interceptors.request.use((config) => {

    const token = getToken();

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

axiosClient.interceptors.response.use(
    (response) => response,

    (error) => {

        return Promise.reject(error);

    }
);

export default axiosClient;