// src/components/checkout/CheckoutAddress.jsx
import React from 'react';
import { CheckCircle, Circle, Home, MapPin } from 'lucide-react';

const CheckoutAddress = ({
    addresses = [],
    selectedAddressId,
    setSelectedAddressId,
    useSavedAddress,
    setUseSavedAddress,
    newAddress,
    setNewAddress,
    saveNewAddress,
    setSaveNewAddress,
    onNext
}) => {
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'saveNewAddress') {
            setSaveNewAddress(checked);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Địa chỉ giao hàng
            </h2>

            {/* Chọn loại địa chỉ */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setUseSavedAddress(true)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${useSavedAddress
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Home size={18} />
                        <span className="font-medium">Địa chỉ đã lưu</span>
                    </div>
                </button>
                <button
                    onClick={() => setUseSavedAddress(false)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${!useSavedAddress
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <MapPin size={18} />
                        <span className="font-medium">Địa chỉ mới</span>
                    </div>
                </button>
            </div>

            {/* Danh sách địa chỉ đã lưu */}
            {useSavedAddress && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {addresses.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">
                            Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                        </p>
                    ) : (
                        addresses.map((address) => (
                            <button
                                key={address.addressId}
                                onClick={() => setSelectedAddressId(address.addressId)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedAddressId === address.addressId
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {selectedAddressId === address.addressId ? (
                                            <CheckCircle size={18} className="text-blue-600" />
                                        ) : (
                                            <Circle size={18} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900">
                                                {address.addressLine}
                                            </span>
                                            {address.defaultAddress && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {address.district}, {address.city}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Form địa chỉ mới */}
            {!useSavedAddress && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="addressLine"
                            value={newAddress.addressLine}
                            onChange={handleAddressChange}
                            placeholder="Số nhà, tên đường..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Quận/Huyện <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={newAddress.district}
                                onChange={handleAddressChange}
                                placeholder="Quận/Huyện"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Thành phố <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleAddressChange}
                                placeholder="Thành phố"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="saveNewAddress"
                            checked={saveNewAddress}
                            onChange={handleCheckboxChange}
                            id="saveNewAddress"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="saveNewAddress" className="text-sm text-slate-700 cursor-pointer">
                            Lưu địa chỉ này vào sổ địa chỉ
                        </label>
                    </div>
                </div>
            )}

            {/* Next button */}
            <button
                onClick={onNext}
                disabled={
                    useSavedAddress
                        ? !selectedAddressId && addresses.length > 0
                        : !newAddress.addressLine || !newAddress.district || !newAddress.city
                }
                className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Tiếp tục thanh toán
            </button>
        </div>
    );
};

export default CheckoutAddress;