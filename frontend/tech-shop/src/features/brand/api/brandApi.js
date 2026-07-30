import axiosClient from "../../../services/axiosClient";

const brandApi = {

    getAll: (params = {}) => {
        return axiosClient.get("/brands", {
            params: {
                pageNum: 1,
                pageSize: 100,
                sortBy: "brandId",
                sortDir: "ASC",
                ...params,
            },
        });
    },

    getById: (id) => {
        return axiosClient.get(`/brands/${id}`);
    }

};

export default brandApi;