// src/components/profile/AddressItem.jsx
import { useState } from "react";
import { Edit2, Trash2, CheckCircle, Circle } from "lucide-react";
import useDeleteAddress from "@/features/addresses/hooks/useDeleteAddress";
import useSetDefaultAddress from "@/features/addresses/hooks/useSetDefaultAddress";

export default function AddressItem({ address, onEdit, onDelete, onUpdate }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteAddress } = useDeleteAddress();
    const { setDefaultAddress, loading: settingDefault } = useSetDefaultAddress();

    const handleSetDefault = async () => {
        if (address.defaultAddress) return;
        try {
            await setDefaultAddress(address.addressId);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Set default address error:', error);
            alert('Không thể đặt làm địa chỉ mặc định. Vui lòng thử lại.');
        }
    };

    const handleDelete = async () => {
        if (address.defaultAddress) {
            alert('Không thể xóa địa chỉ mặc định');
            return;
        }
        if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;

        try {
            setIsDeleting(true);
            await deleteAddress(address.addressId);
            if (onDelete) onDelete();
        } catch (error) {
            console.error('Delete address error:', error);
            alert('Không thể xóa địa chỉ. Vui lòng thử lại.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`border rounded-lg p-3 transition ${address.defaultAddress ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                            {address.addressLine}
                        </span>
                        {address.defaultAddress && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                                Mặc định
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                        {address.district}, {address.city}
                    </div>
                </div>

                <div className="flex items-center gap-0.5 ml-3">
                    {!address.defaultAddress && (
                        <button
                            onClick={handleSetDefault}
                            disabled={settingDefault}
                            className="px-1.5 py-1 text-[10px] text-blue-600 hover:text-blue-700 transition disabled:opacity-50"
                            title="Đặt làm mặc định"
                        >
                            Đặt mặc định
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        disabled={isDeleting}
                        className="p-1 text-slate-400 hover:text-blue-600 transition disabled:opacity-50"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting || address.defaultAddress}
                        className="p-1 text-slate-400 hover:text-red-600 transition disabled:opacity-50"
                        title="Xóa"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}