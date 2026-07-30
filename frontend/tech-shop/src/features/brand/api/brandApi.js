import axiosClient from "../../../services/axiosClient";

const brandApi = {

    getAll: () => {
        return axiosClient.get("/brands");
    },

    getById: (id) => {
        return axiosClient.get(`/brands/${id}`);
    }

};

export default brandApi;