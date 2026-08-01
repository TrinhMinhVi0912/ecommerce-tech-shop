// src/features/admin/products/api/adminProductApi.js
import axiosClient from "@/services/axiosClient";

const adminProductApi = {

    getProducts: (params) => {
        return axiosClient.get("/admin/products", { params });
    },

    getProductById: (id) => {
        return axiosClient.get(`/admin/products/${id}`);
    },

    createProduct: (data) => {
        return axiosClient.post("/admin/products", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateProduct: (id, data) => {
        return axiosClient.put(`/admin/products/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    updateProductStatus: (id, data) => {
        return axiosClient.patch(`/admin/products/${id}/status`, data);
    },

    deleteProduct: (id) => {
        console.log(`🗑️ [API] Deleting product ID: ${id}`);
        return axiosClient.delete(`/admin/products/${id}`);
    }

};

export default adminProductApi;