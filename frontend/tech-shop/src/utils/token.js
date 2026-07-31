export const decodeToken = (token) => {
    if (!token || typeof token !== "string") return null;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        try {
            const parts = token.split(".");
            return JSON.parse(atob(parts[1]));
        } catch {
            return null;
        }
    }
};

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 <= Date.now();
};

export const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:logout"));
};

export const getToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    if (isTokenExpired(token)) {
        clearAuthData();
        return null;
    }
    return token;
};

export const saveToken = (token) => {
    localStorage.setItem("accessToken", token);
};

export const removeToken = () => {
    clearAuthData();
};