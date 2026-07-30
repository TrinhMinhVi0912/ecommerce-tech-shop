import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop } from 'lucide-react';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import useLogin from '@/features/auth/hooks/useLogin';

const Login = () => {

    const navigate = useNavigate();

    // Trạng thái form
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Trạng thái lỗi client-side
    const [fieldErrors, setFieldErrors] = useState({});

    // Custom hook login
    const { login, loading, error: backendError } = useLogin();

    // Validate phía client trước khi submit
    const validate = () => {
        const errors = {};
        if (!userName.trim()) {
            errors.userName = 'Tên đăng nhập là bắt buộc.';
        }
        if (!password) {
            errors.password = 'Mật khẩu là bắt buộc.';
        } else if (password.length < 6) {
            errors.password = 'Mật khẩu phải chứa tối thiểu 6 ký tự.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Truyền đúng payload theo tên trường hệ thống của bạn (username & password)
        const success = await login({
            userName,
            password,
            rememberMe,
        });

        if (success) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Container chính: Card 2 cột */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* ================= BÊN TRÁI: BANNER & MINH HỌA (DESKTOP) ================= */}
                <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-[#1E40AF] to-[#2563EB] text-white relative overflow-hidden">
                    {/* Họa tiết nền trang trí */}
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

                    {/* Logo & Intro */}
                    <a href="/" className="relative z-10">
                        <Laptop className="w-5 h-5 text-blue-600" />
                        <span className="text-base font-bold text-blue-600 tracking-tight">
                            Tech Shop
                        </span>

                        <div className="mt-8 space-y-2">
                            <h1 className="text-3xl font-extrabold tracking-tight">
                                Chào mừng trở lại!
                            </h1>
                            <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm">
                                Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng.
                            </p>
                        </div>
                    </a>

                    {/* Ảnh minh họa công nghệ */}
                    <div className="relative z-10 my-8 flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
                            alt="Tech Shop Setup"
                            className="rounded-2xl shadow-2xl object-cover h-64 w-full border border-white/10 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                        />
                    </div>

                    {/* Slogan chân trang trái */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-200/70">
                        <span>© 2026 Tech Shop Inc.</span>
                        <span>Trải nghiệm công nghệ đỉnh cao</span>
                    </div>
                </div>

                {/* ================= BÊN PHẢI: FORM ĐĂNG NHẬP ================= */}
                <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">

                    {/* Header hiển thị trên Mobile */}
                    <div className="mb-8 lg:hidden">
                        <Laptop className="w-5 h-5 text-blue-600" />
                        <span className="text-base font-bold text-blue-600 tracking-tight">
                            Tech Shop
                        </span>
                        <h2 className="mt-4 text-2xl font-bold text-slate-800">Chào mừng trở lại!</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng.
                        </p>
                    </div>

                    <div className="hidden lg:block mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Đăng nhập tài khoản</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Vui lòng nhập thông tin credentials của bạn.
                        </p>
                    </div>

                    {/* Alert thông báo lỗi từ Backend */}
                    {backendError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-700 text-sm animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Đăng nhập thất bại</p>
                                <p className="mt-0.5 text-xs text-red-600">
                                    {typeof backendError === 'string' ? backendError : 'Tên đăng nhập hoặc mật khẩu không chính xác.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        {/* Input UserName */}
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="userName"
                                    type="text"
                                    disabled={loading}
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value);
                                        if (fieldErrors.username) {
                                            setFieldErrors((prev) => ({ ...prev, username: '' }));
                                        }
                                    }}
                                    placeholder="Nhập tên đăng nhập"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${fieldErrors.username
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-slate-200 focus:border-[#2563EB] focus:ring-blue-100'
                                        } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
                                />
                            </div>
                            {fieldErrors.username && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.username}</p>
                            )}
                        </div>

                        {/* Input Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={loading}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) {
                                            setFieldErrors((prev) => ({ ...prev, password: '' }));
                                        }
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-11 py-2.5 bg-white border rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${fieldErrors.password
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-slate-200 focus:border-[#2563EB] focus:ring-blue-100'
                                        } disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
                                />
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none disabled:cursor-not-allowed"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Checkbox Ghi nhớ & Link Quên mật khẩu */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    disabled={loading}
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] disabled:cursor-not-allowed"
                                />
                                <span className="text-slate-600 text-xs sm:text-sm">Ghi nhớ đăng nhập</span>
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Nút Đăng nhập */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1E40AF] active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </button>
                    </form>

                    {/* Đường phân cách */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium">Hoặc</span>
                        </div>
                    </div>

                    {/* Social Logins (Placeholder) */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => { }}
                            className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => { }}
                            className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Link chuyển hướng Đăng ký */}
                    <div className="mt-8 text-center text-sm text-slate-600">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#2563EB] hover:text-[#1E40AF] transition-colors"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;