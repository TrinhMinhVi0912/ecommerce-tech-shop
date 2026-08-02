// src/pages/checkout/Checkout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import useProfile from '@/features/user/hooks/useProfile';
import useCheckout from '@/features/order/hooks/useCheckout';
import useCreateVnPayPayment from '@/features/payment/hooks/useCreateVnPayPayment';
import useCartStore from '@/store/cartStore';
import CheckoutAddress from '@/components/checkout/CheckoutAddress';
import CheckoutItems from '@/components/checkout/CheckoutItems';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CheckoutPayment from '@/components/checkout/CheckoutPayment';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import LoginRequired from '@/components/cart/LoginRequired';

export default function Checkout() {
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { data: profileData, loading: profileLoading } = useProfile();
    const { checkout, loading: checkoutLoading, data: checkoutResult } = useCheckout();
    const { createVnPayPayment, loading: vnpayLoading, data: vnpayData } = useCreateVnPayPayment();
    const { fetchCart } = useCartStore();

    const [step, setStep] = useState(1);
    const [cartItemIds, setCartItemIds] = useState([]);
    const [showVNPayIframe, setShowVNPayIframe] = useState(false);
    const [vnpayUrl, setVnpayUrl] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const hasCreatedPayment = useRef(false);
    const hasRedirected = useRef(false);

    // Address states
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useSavedAddress, setUseSavedAddress] = useState(true);
    const [newAddress, setNewAddress] = useState({
        addressLine: '',
        district: '',
        city: '',
        defaultAddress: false
    });
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    // Payment states
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [note, setNote] = useState('');
    const [couponCode, setCouponCode] = useState('');

    // Lấy cartItemIds từ state hoặc localStorage
    useEffect(() => {
        const ids = location.state?.cartItemIds || JSON.parse(localStorage.getItem('checkoutItems') || '[]');
        if (ids.length === 0) {
            navigate('/cart');
            return;
        }
        setCartItemIds(ids);
    }, [location, navigate]);

    const userInfo = profileData?.data || profileData;
    const addresses = userInfo?.addresses || [];

    // Chọn địa chỉ mặc định
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddress = addresses.find(addr => addr.defaultAddress);
            setSelectedAddressId(defaultAddress?.addressId || addresses[0]?.addressId);
        }
    }, [addresses]);

    // Xử lý sau khi tạo VNPay payment thành công
    useEffect(() => {
        if (vnpayData?.paymentUrl && !hasRedirected.current) {
            console.log('✅ Got payment URL, redirecting to VNPay...');
            hasRedirected.current = true;
            setIsCreatingPayment(false);
            setIsRedirecting(true);
            localStorage.removeItem('checkoutItems');

            setTimeout(() => {
                window.location.href = vnpayData.paymentUrl;
            }, 1500);
        }
    }, [vnpayData]);

    // Xử lý sau khi checkout thành công - tạo VNPay payment
    useEffect(() => {
        const handleAfterCheckout = async () => {
            if (hasCreatedPayment.current || !checkoutResult || paymentMethod !== 'VNPAY') {
                return;
            }

            hasCreatedPayment.current = true;

            const orderIdFromResult = checkoutResult.orderId;
            setOrderId(orderIdFromResult);
            setIsCreatingPayment(true);

            try {
                console.log('🔄 Creating VNPay payment for order:', orderIdFromResult);
                await createVnPayPayment(orderIdFromResult);
            } catch (error) {
                console.error('❌ Create VNPay payment error:', error);
                const errorMessage = error.response?.data?.message || 'Không thể tạo thanh toán VNPay. Vui lòng thử lại.';
                toast.error(errorMessage);
                setIsCreatingPayment(false);
                setStep(2);
                hasCreatedPayment.current = false;
            }
        };

        handleAfterCheckout();
    }, [checkoutResult, paymentMethod, createVnPayPayment]);

    if (authLoading || profileLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-32 bg-slate-200 rounded-xl"></div>
                            <div className="h-48 bg-slate-200 rounded-xl"></div>
                        </div>
                        <div className="h-64 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginRequired />;
    }

    const handleSubmit = async () => {
        if (!useSavedAddress && (!newAddress.addressLine || !newAddress.district || !newAddress.city)) {
            toast.warning('Vui lòng nhập đầy đủ thông tin địa chỉ');
            return;
        }

        if (useSavedAddress && !selectedAddressId) {
            toast.warning('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        hasCreatedPayment.current = false;
        hasRedirected.current = false;

        const request = {
            cartItemIds: cartItemIds,
            useSavedAddress: useSavedAddress,
            addressId: useSavedAddress ? selectedAddressId : null,
            newAddress: !useSavedAddress ? newAddress : null,
            saveNewAddress: !useSavedAddress ? saveNewAddress : false,
            receiverName: userInfo?.fullName || '',
            receiverPhone: userInfo?.phone || '',
            couponCode: couponCode || null,
            paymentMethod: paymentMethod,
            note: note || null
        };

        try {
            setIsCreatingOrder(true);
            console.log('🔄 Creating order with:', request);

            const result = await checkout(request);
            console.log('✅ Order created:', result);

            if (result) {
                // ✅ Refresh giỏ hàng sau khi checkout thành công
                await fetchCart();

                if (paymentMethod === 'COD') {
                    setStep(3);
                    localStorage.removeItem('checkoutItems');
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Nếu checkout thành công và là COD
    if (checkoutResult && step === 3 && paymentMethod === 'COD') {
        return <CheckoutSuccess orderData={checkoutResult} />;
    }

    // Hiển thị khi đang tạo order
    if (isCreatingOrder) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900 mt-4">
                        Đang tạo đơn hàng...
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Vui lòng đợi trong giây lát
                    </p>
                </div>
            </div>
        );
    }

    // Hiển thị khi đang tạo VNPay payment
    if (isCreatingPayment) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900 mt-4">
                        Đang tạo liên kết thanh toán VNPay...
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Vui lòng đợi trong giây lát
                    </p>
                </div>
            </div>
        );
    }

    // Hiển thị khi đang redirect sang VNPay
    if (isRedirecting) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900 mt-4">
                        Đang chuyển đến cổng thanh toán VNPay...
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Vui lòng đợi trong giây lát
                    </p>
                    <button
                        onClick={() => {
                            if (vnpayData?.paymentUrl) {
                                window.location.href = vnpayData.paymentUrl;
                            }
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Nhấn vào đây nếu không tự chuyển
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/cart')}
                    className="p-2 hover:bg-slate-100 rounded-full transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Thanh toán</h1>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Bước {step}/3
                </span>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                        1
                    </div>
                    <span className="text-sm font-medium">Địa chỉ</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-200">
                    <div className={`h-full bg-blue-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                        2
                    </div>
                    <span className="text-sm font-medium">Thanh toán</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">
                    {step === 1 && (
                        <CheckoutAddress
                            addresses={addresses}
                            selectedAddressId={selectedAddressId}
                            setSelectedAddressId={setSelectedAddressId}
                            useSavedAddress={useSavedAddress}
                            setUseSavedAddress={setUseSavedAddress}
                            newAddress={newAddress}
                            setNewAddress={setNewAddress}
                            saveNewAddress={saveNewAddress}
                            setSaveNewAddress={setSaveNewAddress}
                            onNext={() => setStep(2)}
                        />
                    )}

                    {step === 2 && (
                        <CheckoutPayment
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            note={note}
                            setNote={setNote}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            onBack={() => setStep(1)}
                            onSubmit={handleSubmit}
                            loading={checkoutLoading || vnpayLoading}
                        />
                    )}

                    <CheckoutItems cartItemIds={cartItemIds} />
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1">
                    <CheckoutSummary
                        cartItemIds={cartItemIds}
                        couponCode={couponCode}
                    />
                </div>
            </div>
        </div>
    );
}