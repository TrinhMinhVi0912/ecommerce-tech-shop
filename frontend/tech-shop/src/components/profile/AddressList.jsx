// src/components/profile/AddressList.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import AddressItem from "./AddressItem";
import AddressForm from "./AddressForm";

export default function AddressList({ addresses = [], onUpdate }) {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAddSuccess = () => {
        setShowForm(false);
        if (onUpdate) onUpdate();
    };

    const handleEditSuccess = () => {
        setEditingAddress(null);
        if (onUpdate) onUpdate();
    };

    const handleDeleteSuccess = () => {
        if (onUpdate) onUpdate();
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900">
                    Sổ địa chỉ
                </h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 text-xs"
                    >
                        <Plus size={14} />
                        Thêm
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-3">
                    <AddressForm
                        onSuccess={handleAddSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {editingAddress && (
                <div className="mb-3">
                    <AddressForm
                        address={editingAddress}
                        isEditing={true}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setEditingAddress(null)}
                    />
                </div>
            )}

            {addresses.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                    <p className="text-sm">Chưa có địa chỉ</p>
                    <p className="text-xs">Nhấn "Thêm" để tạo mới</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {addresses.map((address) => (
                        <AddressItem
                            key={address.addressId}
                            address={address}
                            onEdit={() => setEditingAddress(address)}
                            onDelete={handleDeleteSuccess}
                            onUpdate={onUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}