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
    }

};

export default authApi;