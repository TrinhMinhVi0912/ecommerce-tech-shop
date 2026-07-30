export const getToken = () => {

    return localStorage.getItem("accessToken");

}

export const saveToken = (token) => {

    localStorage.setItem("accessToken", token);

}

export const removeToken = () => {

    localStorage.removeItem("accessToken");

}