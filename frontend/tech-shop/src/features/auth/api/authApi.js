// src/features/auth/api/authApi.js
import axiosClient from "../../../services/axiosClient";

const authApi = {

    login: (data) => {
        return axiosClient.post("/auth/login", data);
    },

    register: (data) => {
        return axiosClient.post("/auth/register", data);
    },

    logout: () => {
        return axiosClient.post("/auth/logout");
    },

    introspect: () => {
        return axiosClient.post("/auth/introspect");
    },

    getCurrentUser: () => {
        return axiosClient.get("/auth/me");
    }

};

export default authApi;