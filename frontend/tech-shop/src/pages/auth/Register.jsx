import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Loader2,
    User,
    Mail,
    Phone,
    Lock
} from "lucide-react";

import useRegister from "@/features/auth/hooks/useRegister";

export default function Register() {

    const navigate = useNavigate();

    const { register, loading, error } = useRegister();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const validate = () => {

        const newErrors = {};

        if (!formData.fullName.trim())
            newErrors.fullName = "Vui lòng nhập họ và tên.";

        if (!formData.userName.trim())
            newErrors.userName = "Vui lòng nhập tên đăng nhập.";

        if (formData.userName.length < 4)
            newErrors.userName = "Tên đăng nhập tối thiểu 4 ký tự.";

        if (!formData.email.trim())
            newErrors.email = "Vui lòng nhập email.";

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData.email && !emailRegex.test(formData.email))
            newErrors.email = "Email không hợp lệ.";

        if (!formData.phone.trim())
            newErrors.phone = "Vui lòng nhập số điện thoại.";

        if (!formData.password)
            newErrors.password = "Vui lòng nhập mật khẩu.";

        if (formData.password.length < 6)
            newErrors.password = "Mật khẩu tối thiểu 6 ký tự.";

        if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        const success = await register({
            fullName: formData.fullName,
            userName: formData.userName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (success) {

            navigate("/login");

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full grid lg:grid-cols-2">

                {/* Left */}

                <div className="hidden lg:flex flex-col justify-center bg-blue-600 text-white p-12">

                    <h1 className="text-4xl font-bold mb-5">
                        Tham gia Tech Shop
                    </h1>

                    <p className="text-blue-100 leading-7">
                        Tạo tài khoản để trải nghiệm hệ thống mua sắm thiết bị công nghệ
                        hiện đại, quản lý đơn hàng, danh sách yêu thích và nhận
                        nhiều ưu đãi hấp dẫn.
                    </p>

                </div>

                {/* Right */}

                <div className="p-10">

                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        Đăng ký
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Tạo tài khoản mới.
                    </p>

                    {error && (

                        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
                            {error}
                        </div>

                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* FullName */}

                        <div>

                            <label className="text-sm font-medium">
                                Họ và tên
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <User className="w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                    placeholder="Nguyễn Văn A"
                                />

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.fullName}
                            </p>

                        </div>

                        {/* Username */}

                        <div>

                            <label className="text-sm font-medium">
                                Tên đăng nhập
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <User className="w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                    placeholder="UserName"
                                />

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.userName}
                            </p>

                        </div>

                        {/* Email */}

                        <div>

                            <label className="text-sm font-medium">
                                Email
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <Mail className="w-5 h-5 text-slate-400" />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                    placeholder="example@gmail.com"
                                />

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>

                        </div>

                        {/* Phone */}

                        <div>

                            <label className="text-sm font-medium">
                                Số điện thoại
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <Phone className="w-5 h-5 text-slate-400" />

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                    placeholder="09xxxxxxxx"
                                />

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>

                        </div>

                        {/* Password */}

                        <div>

                            <label className="text-sm font-medium">
                                Mật khẩu
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <Lock className="w-5 h-5 text-slate-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>

                        </div>

                        {/* Confirm */}

                        <div>

                            <label className="text-sm font-medium">
                                Xác nhận mật khẩu
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-3">

                                <Lock className="w-5 h-5 text-slate-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-3 outline-none"
                                />

                            </div>

                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword}
                            </p>

                        </div>

                        <button
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition flex justify-center items-center gap-2 disabled:opacity-70"
                        >

                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                "Đăng ký"
                            )}

                        </button>

                    </form>

                    <div className="text-center mt-6 text-sm">

                        Đã có tài khoản?

                        <Link
                            to="/login"
                            className="ml-2 text-blue-600 font-semibold hover:underline"
                        >
                            Đăng nhập
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}