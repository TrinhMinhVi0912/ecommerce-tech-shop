// src/components/profile/ProfileAvatar.jsx
import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import useUploadAvatar from "@/features/user/hooks/useUploadAvatar";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/imageUtils";

export default function ProfileAvatar({ onAvatarUpdate }) {
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const fileInputRef = useRef(null);
    const { uploadAvatar } = useUploadAvatar();
    const { user, refreshUser, isAuthenticated } = useAuth();

    // ✅ Lấy avatar từ user trong AuthContext
    useEffect(() => {
        if (user?.avatarUrl) {
            setAvatarUrl(getImageUrl(user.avatarUrl));
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
            alert('Vui lòng chọn file ảnh');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        try {
            setIsUploading(true);
            await uploadAvatar(file);

            // ✅ Refresh user để lấy avatar mới
            await refreshUser();

            if (onAvatarUpdate) {
                await onAvatarUpdate();
            }
            alert('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            console.error('Upload avatar error:', error);
            alert('Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
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