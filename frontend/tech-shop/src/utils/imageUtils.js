// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${cleanBase}${cleanPath}`;
};

// ✅ Hàm lấy image URL với cache busting
export const getImageUrlWithCacheBust = (imagePath, timestamp = Date.now()) => {
    const url = getImageUrl(imagePath);
    if (!url) return null;
    return `${url}?t=${timestamp}`;
};

// Helper để lấy thumbnail từ danh sách ảnh
export const getThumbnail = (images) => {
    if (!images || images.length === 0) return null;
    const thumbnail = images.find(img => img.thumbnail === true);
    return thumbnail?.imagePath || images[0]?.imagePath || null;
};

export const getProcessedImages = (images) => {
    if (!images || images.length === 0) return [];
    return images.map(img => ({
        ...img,
        imageUrl: getImageUrl(img.imagePath)
    }));
};

export const getDefaultImage = () => {
    return '/images/products/default.jpg';
};

export const getSafeImageUrl = (imagePath) => {
    const url = getImageUrl(imagePath);
    return url || getDefaultImage();
};