// src/components/product/productdetails/ReviewItem.jsx
import { useState } from "react";
import { Star, Trash2, Edit2, Check, X } from "lucide-react";
import useDeleteReview from "@/features/review/hooks/useDeleteReview";
import useUpdateReview from "@/features/review/hooks/useUpdateReview";
import { getImageUrl } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ReviewItem({ review, productId, onDelete, onUpdate }) {
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const [hoveredRating, setHoveredRating] = useState(0);
    const { deleteReview, loading: deleting } = useDeleteReview();
    const { updateReview, loading: updating } = useUpdateReview();
    const { user } = useAuth();

    const isOwnReview = user?.userId === review.user?.userId;

    // ✅ Xóa: chỉ cần productId
    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

        try {
            await deleteReview(productId);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Delete review error:", error);
            toast.error('Không thể xóa đánh giá. Vui lòng thử lại.');
        }
    };

    // ✅ Cập nhật: chỉ cần productId và request
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await updateReview(productId, {
                rating: Number(rating),
                comment: comment.trim()
            });
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Update review error:", error);
            toast.error('Không thể cập nhật đánh giá. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setRating(review.rating);
        setComment(review.comment);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
            />
        ));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const avatarUrl = getImageUrl(review.user?.avatarUrl);
    const displayName = review.user?.fullName || 'Người dùng ẩn danh';

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=40`;
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-2">
                        {/* User info */}
                        <div>
                            <div className="font-medium text-slate-900">
                                {displayName}
                                {isOwnReview && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        Bạn
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {isEditing ? (
                                        [...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setRating(i + 1)}
                                                onMouseEnter={() => setHoveredRating(i + 1)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={20}
                                                    className={`transition ${(hoveredRating > 0 ? i < hoveredRating : i < rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-slate-300'
                                                        }`}
                                                />
                                            </button>
                                        ))
                                    ) : (
                                        renderStars(review.rating)
                                    )}
                                </div>
                                <span className="text-sm text-slate-500">
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-2">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1 disabled:opacity-50"
                                    >
                                        <Check size={14} /> Lưu
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-sm flex items-center gap-1"
                                    >
                                        <X size={14} /> Hủy
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-slate-700 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions - Chỉ hiển thị khi là review của user */}
                {isOwnReview && !isEditing && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition rounded-lg hover:bg-slate-50"
                            title="Chỉnh sửa"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-50 disabled:opacity-50"
                            title="Xóa"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}