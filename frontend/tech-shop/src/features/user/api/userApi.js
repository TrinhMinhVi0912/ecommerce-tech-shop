import axiosClient from "../../../services/axiosClient";

const userApi = {

    getProfile: () => {
        return axiosClient.get("/users/profile");
    },

    updateProfile: (data) => {
        return axiosClient.post("/users/change-profile", data);
    },

    changePassword: (data) => {
        return axiosClient.post("/users/change-password", data);
    },

    uploadAvatar: (file) => {

        const formData = new FormData();

        formData.append("avatar", file);

        return axiosClient.patch(
            "/users/me/avatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

    }

};

export default userApi;