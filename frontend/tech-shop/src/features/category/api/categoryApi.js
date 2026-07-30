import axiosClient from "../../../services/axiosClient";

const categoryService = {
    getAll: (params = {}) => {
        return axiosClient.get("/categories", {
            params: {
                pageNum: 1,
                pageSize: 100,
                sortBy: "categoryId",
                sortDir: "ASC",
                ...params,
            },
        });
    },
    getById: (id) => {
        return axiosClient.get(`/categories/${id}`);
    }
};

export default categoryService;