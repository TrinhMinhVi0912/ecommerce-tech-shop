import axios from "axios";
baseURL: import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,

    headers: {
        "Content-Type": "application/json",
    },
});

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