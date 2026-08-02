import axiosClient from "@/services/axiosClient";

const userAdminApi = {

    getUsers: (params) => {
        return axiosClient.get("/admin/users", { params });
    },

    updateUserStatus: (userId, data) => {
        return axiosClient.patch(`/admin/users/${userId}/status`, data);
    }

};

export default userAdminApi;