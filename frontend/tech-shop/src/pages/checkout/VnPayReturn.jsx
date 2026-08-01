// src/pages/checkout/VnPayReturn.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCartStore from '@/store/cartStore';

export default function VnPayReturn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { fetchCart } = useCartStore();

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) {
            return;
        }

        const allParams = Object.fromEntries(searchParams);
        console.log('🔍 All VNPay params from URL:', allParams);

        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus');
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');

        hasProcessed.current = true;

        let orderIdFromParams = '';
        try {
            if (vnp_OrderInfo) {
                const decoded = decodeURIComponent(vnp_OrderInfo);
                orderIdFromParams = decoded.replace('Thanh toan don hang:', '').trim();
            }
        } catch (error) {
            orderIdFromParams = vnp_OrderInfo || '';
        }
        setOrderId(orderIdFromParams || vnp_TxnRef || '');

        if (!vnp_ResponseCode) {
            setStatus('error');
            setMessage('Không nhận được thông tin thanh toán từ VNPay.');
            setTimeout(() => {
                navigate('/cart');
            }, 3000);
            return;
        }

        if (vnp_ResponseCode === '24') {
            setStatus('error');
            setMessage('Bạn đã hủy thanh toán.');
            setTimeout(() => {
                navigate('/cart');
            }, 3000);
            return;
        }

        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
            setStatus('success');
            setMessage('Thanh toán VNPay thành công! Đơn hàng đã được xác nhận.');
            localStorage.removeItem('checkoutItems');

            // ✅ Refresh giỏ hàng sau khi thanh toán thành công
            fetchCart();

            setTimeout(() => {
                navigate('/orders');
            }, 3000);
            return;
        }

        setStatus('error');
        const errorMessages = {
            '01': 'Lỗi kỹ thuật',
            '02': 'Giao dịch bị từ chối',
            '03': 'Giao dịch bị hủy',
            '04': 'Lỗi hệ thống',
            '05': 'Giao dịch đang được xử lý',
            '07': 'Số tiền không hợp lệ',
            '08': 'Mã đơn hàng không hợp lệ',
            '09': 'Thông tin giao dịch không hợp lệ',
            '10': 'Lỗi kết nối',
            '11': 'Giao dịch đã bị hủy',
            '12': 'Tài khoản không đủ tiền',
            '13': 'Lỗi xác thực',
            '24': 'Người dùng hủy thanh toán'
        };
        const errorMsg = errorMessages[vnp_ResponseCode] || 'Thanh toán thất bại. Vui lòng thử lại.';
        setMessage(`Thanh toán thất bại: ${errorMsg}`);

        setTimeout(() => {
            navigate('/cart');
        }, 5000);

    }, [searchParams, navigate, fetchCart]);

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900 mt-4">
                        Đang xử lý kết quả thanh toán...
                    </h2>
                    <p className="text-slate-500">
                        Vui lòng đợi trong giây lát
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className={`bg-white rounded-xl border p-8 text-center ${status === 'success' ? 'border-green-500' : 'border-red-500'
                }`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    {status === 'success' ? (
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </h2>

                <p className="text-slate-600 mb-2">
                    {message}
                </p>

                {orderId && (
                    <p className="text-sm text-slate-500 mb-6">
                        Mã đơn hàng: <span className="font-medium">{orderId}</span>
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {status === 'success' ? (
                        <>
                            <button
                                onClick={() => navigate('/orders')}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Xem đơn hàng của tôi
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Quay lại giỏ hàng
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                            >
                                Về trang chủ
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}