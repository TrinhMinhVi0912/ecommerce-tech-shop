// src/pages/profile/Profile.jsx
import { useState, useEffect } from "react";
import useProfile from "@/features/user/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import AddressList from "@/components/profile/AddressList";

export default function Profile() {
    const { user: authUser, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
    const { data, loading, refetch } = useProfile();

    const profileData = data?.data || data;
    const userInfo = profileData || authUser;
    const addresses = userInfo?.addresses || [];

    // ✅ Refresh user khi component mount
    useEffect(() => {
        if (isAuthenticated) {
            refreshUser();
        }
    }, [isAuthenticated, refreshUser]);

    const handleUpdateSuccess = async () => {
        await refetch();
        await refreshUser(); // ✅ Refresh cả AuthContext
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="h-64 bg-slate-200 rounded-xl"></div>
                        <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Tài khoản của tôi
            </h1>

            {/* Hàng 1: Avatar + Thông tin cá nhân */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                    {/* ✅ Không cần truyền user prop */}
                    <ProfileAvatar onAvatarUpdate={handleUpdateSuccess} />
                </div>
                <div className="lg:col-span-2">
                    <ProfileInfo
                        user={userInfo}
                        onUpdate={handleUpdateSuccess}
                    />
                </div>
            </div>

            {/* Hàng 2: Đổi mật khẩu + Sổ địa chỉ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <ChangePasswordForm onSuccess={handleUpdateSuccess} />
                </div>
                <div>
                    <AddressList
                        addresses={addresses}
                        onUpdate={handleUpdateSuccess}
                    />
                </div>
            </div>
        </div>
    );
}