// src/components/profile/ChangePasswordForm.jsx
import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import useChangePassword from "@/features/user/hooks/useChangePassword";

export default function ChangePasswordForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState({});
    const { changePassword, loading } = useChangePassword();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
        if (!formData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            alert('Đổi mật khẩu thành công!');
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});

            // ✅ Gọi onSuccess sau khi đổi mật khẩu thành công
            if (onSuccess) {
                await onSuccess();
            }
        } catch (error) {
            console.error('Change password error:', error);
            alert(error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-full">
            <h2 className="text-base font-bold text-slate-900 mb-3">
                Đổi mật khẩu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mật khẩu cũ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.old ? 'text' : 'password'}
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 ${errors.oldPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-slate-200 focus:ring-blue-500'
                                }`}
                            placeholder="Nhập mật khẩu cũ"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('old')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword.old ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.oldPassword && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.oldPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.new ? 'text' : 'password'}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 ${errors.newPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-slate-200 focus:ring-blue-500'
                                }`}
                            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('new')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.newPassword}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-slate-200 focus:ring-blue-500'
                                }`}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                        <button
                            type="button"
                            onClick={() => toggleShowPassword('confirm')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
                >
                    <Save size={14} />
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
            </form>
        </div>
    );
}