// src/components/profile/ProfileInfo.jsx
import { useState } from "react";
import { Save, X } from "lucide-react";
import useUpdateProfile from "@/features/user/hooks/useUpdateProfile";
import { useAuth } from "@/context/AuthContext";

export default function ProfileInfo({ user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });
    const { updateProfile, loading } = useUpdateProfile();
    const { refreshUser } = useAuth(); // ✅ Thêm refreshUser

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);

            // ✅ Refresh AuthContext để cập nhật thông tin user
            await refreshUser();

            if (onUpdate) {
                await onUpdate();
            }
            setIsEditing(false);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Update profile error:', error);
            alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || '',
            phone: user?.phone || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900">
                    Thông tin cá nhân
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5">Email không thể thay đổi</p>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 text-xs disabled:opacity-50"
                        >
                            <Save size={14} />
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 text-xs"
                        >
                            <X size={14} />
                            Hủy
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-2">
                    <div className="flex py-1.5 border-b border-slate-100">
                        <span className="w-24 text-xs text-slate-500">Họ và tên</span>
                        <span className="text-sm text-slate-900">{user?.fullName || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex py-1.5 border-b border-slate-100">
                        <span className="w-24 text-xs text-slate-500">Email</span>
                        <span className="text-sm text-slate-900">{user?.email || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex py-1.5">
                        <span className="w-24 text-xs text-slate-500">Số điện thoại</span>
                        <span className="text-sm text-slate-900">{user?.phone || 'Chưa cập nhật'}</span>
                    </div>
                </div>
            )}
        </div>
    );
}