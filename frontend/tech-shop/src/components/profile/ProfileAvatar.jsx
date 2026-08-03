// src/components/profile/ProfileAvatar.jsx
import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import useUploadAvatar from "@/features/user/hooks/useUploadAvatar";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/imageUtils";
import { useToast } from "@/context/ToastContext";

export default function ProfileAvatar({ onAvatarUpdate }) {
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const fileInputRef = useRef(null);
    const { uploadAvatar } = useUploadAvatar();
    const { user, refreshUser, isAuthenticated, updateUser } = useAuth();
    const { success, error } = useToast();

    // Lấy avatar từ user
    useEffect(() => {
        if (user?.avatarUrl) {
            const url = getImageUrl(user.avatarUrl);
            setAvatarUrl(url);
        } else {
            setAvatarUrl(null);
        }
    }, [user?.avatarUrl]);

    const displayName = user?.fullName || user?.userName || 'User';
    const firstLetter = displayName.charAt(0).toUpperCase();

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            error('Vui lòng chọn file ảnh');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            error('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        try {
            setIsUploading(true);

            const result = await uploadAvatar(file);

            console.log('📤 Upload result:', result);

            const newAvatarUrl = result?.avatarUrl || result?.data?.avatarUrl;

            if (newAvatarUrl) {
                // Cập nhật user trong AuthContext
                const updatedUser = {
                    ...user,
                    avatarUrl: newAvatarUrl
                };
                updateUser(updatedUser);

                // Đợi 1 giây để server xử lý ảnh
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Refresh user để lấy thông tin mới nhất
                const refreshedUser = await refreshUser();
                console.log('🔄 Profile refresh user result:', refreshedUser);

                // Cập nhật avatar URL
                const url = getImageUrl(newAvatarUrl);
                setAvatarUrl(url);

                success('Cập nhật ảnh đại diện thành công!');

                // ✅ Dispatch event để thông báo cho Navbar
                window.dispatchEvent(new CustomEvent('avatar-updated', {
                    detail: { avatarUrl: newAvatarUrl }
                }));

                // Gọi callback để cập nhật các component khác
                if (onAvatarUpdate) {
                    await onAvatarUpdate();
                }
            } else {
                // Đợi 1 giây rồi refresh
                await new Promise(resolve => setTimeout(resolve, 1000));
                await refreshUser();
                success('Cập nhật ảnh đại diện thành công!');

                // ✅ Dispatch event
                window.dispatchEvent(new CustomEvent('avatar-updated'));
            }

        } catch (error) {
            console.error('Upload avatar error:', error);
            error(error.response?.data?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('❌ Image load error:', avatarUrl);
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=96`;
                            }}
                        />
                    ) : (
                        <span>{firstLetter}</span>
                    )}
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Camera size={14} />
                    )}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="mt-2">
                <h3 className="font-semibold text-sm text-slate-900">
                    {displayName}
                </h3>
                <p className="text-xs text-slate-500">
                    {user?.email}
                </p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 mt-1">
                    {user?.role || 'User'}
                </span>
            </div>
        </div>
    );
}