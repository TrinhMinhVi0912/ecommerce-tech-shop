// src/components/profile/AddressForm.jsx
import { useState } from "react";
import { Save, X } from "lucide-react";
import useAddAddress from "@/features/addresses/hooks/useAddAddress";
import useUpdateAddress from "@/features/addresses/hooks/useUpdateAddress";

export default function AddressForm({ address, isEditing = false, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        addressLine: address?.addressLine || '',
        city: address?.city || '',
        district: address?.district || '',
        defaultAddress: address?.defaultAddress || false,
    });

    const { addAddress, loading: adding } = useAddAddress();
    const { updateAddress, loading: updating } = useUpdateAddress();

    const isLoading = adding || updating;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.addressLine.trim() || !formData.city.trim() || !formData.district.trim()) {
            alert('Vui lòng nhập đầy đủ thông tin địa chỉ');
            return;
        }

        try {
            if (isEditing && address) {
                await updateAddress(address.addressId, {
                    addressLine: formData.addressLine,
                    city: formData.city,
                    district: formData.district,
                });
            } else {
                await addAddress(formData);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Save address error:', error);
            alert('Không thể lưu địa chỉ. Vui lòng thử lại.');
        }
    };

    return (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
            <h3 className="font-medium text-sm text-slate-900 mb-2">
                {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleChange}
                        placeholder="Số nhà, tên đường..."
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-0.5">
                            Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Thành phố"
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-0.5">
                            Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Quận/Huyện"
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="defaultAddress"
                            checked={formData.defaultAddress}
                            onChange={handleChange}
                            id="defaultAddress"
                            className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="defaultAddress" className="text-xs text-slate-700 cursor-pointer">
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>
                )}

                <div className="flex gap-2 pt-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 text-xs disabled:opacity-50"
                    >
                        <Save size={14} />
                        {isLoading ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 text-xs"
                    >
                        <X size={14} />
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}