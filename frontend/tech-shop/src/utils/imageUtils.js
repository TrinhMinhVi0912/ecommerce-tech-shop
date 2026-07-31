// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Nếu đã có http/https thì trả về nguyên
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Lấy base URL từ biến môi trường
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    // Đảm bảo không bị trùng dấu '/'
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${cleanBase}${cleanPath}`;
};

// Helper để lấy thumbnail từ danh sách ảnh
export const getThumbnail = (images) => {
    if (!images || images.length === 0) return null;
    const thumbnail = images.find(img => img.thumbnail === true);
    return thumbnail?.imagePath || images[0]?.imagePath || null;
};

// Helper để lấy tất cả ảnh đã xử lý URL
export const getProcessedImages = (images) => {
    if (!images || images.length === 0) return [];
    return images.map(img => ({
        ...img,
        imageUrl: getImageUrl(img.imagePath)
    }));
};