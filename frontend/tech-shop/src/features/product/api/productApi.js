import axiosClient from "../../../services/axiosClient";

const productApi = {

    getAll: (params) => {
        return axiosClient.get("/products", {
            params,
        });
    },

    getById: (id) => {
        return axiosClient.get(`/products/${id}`);
    },

    compare: (productId1, productId2) => {
        return axiosClient.get("/products/compare", {
            params: {
                productId1,
                productId2,
            },
        });
    }

};

export default productApi;