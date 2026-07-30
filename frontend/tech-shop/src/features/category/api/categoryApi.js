export const getCategories = () => {
    return axiosClient.get("/categories");
};