import axiosClient from "../../../services/axiosClient";

const bannerApi = {

    getActive: () => {
        return axiosClient.get("/banners");
    }

};

export default bannerApi;