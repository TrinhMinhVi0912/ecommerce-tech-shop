import axiosClient from "../../../services/axiosClient";

const categoryService = {
    getAll: () => {
        return axiosClient.get("/categories");
    },
    getById: (id) => {
        return axiosClient.get(`/categories/${id}`);
    }
};

export default categoryService;