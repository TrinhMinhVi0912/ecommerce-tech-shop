import { useState } from "react";
import { Star, Trash2, Edit2, Check, X } from "lucide-react";
import useDeleteReview from "@/features/review/hooks/useDeleteReview";

export default function ReviewItem({ review, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment);
    const { deleteReview, loading: deleting } = useDeleteReview();

    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
            try {
                await deleteReview(review.reviewId);
                onDelete();
            } catch (error) {
                console.error("Delete review error:", error);
            }
        }
    };

    const handleUpdate = async () => {
        // Implement update logic
        // await updateReview(review.productId, { rating, comment });
        setIsEditing(false);
        onUpdate();
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

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.user?.fullName?.charAt(0) || 'U'}
                    </div>

                    <div className="space-y-2">
                        {/* User info */}
                        <div>
                            <div className="font-medium text-slate-900">
                                {review.user?.fullName || 'Người dùng ẩn danh'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {isEditing ? (
                                        [...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setRating(i + 1)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    size={20}
                                                    className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
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
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        ) : (
                            <p className="text-slate-700 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}

                        {/* Edit actions */}
                        {isEditing && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                                >
                                    <Check size={14} /> Lưu
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setRating(review.rating);
                                        setComment(review.comment);
                                    }}
                                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-sm flex items-center gap-1"
                                >
                                    <X size={14} /> Hủy
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {!isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition rounded-lg hover:bg-slate-50"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}