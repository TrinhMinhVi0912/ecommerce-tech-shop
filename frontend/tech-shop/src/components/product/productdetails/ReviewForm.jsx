// src/components/product/productdetails/ReviewForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import useAddReview from "@/features/review/hooks/useAddReview";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ReviewForm({ productId, onSuccess, existingReview = null }) {
    const toast = useToast();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { addReview, loading } = useAddReview();
    const { isAuthenticated } = useAuth();

    // ✅ Nếu chưa đăng nhập, hiển thị thông báo đăng nhập
    if (!isAuthenticated) {
        return (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
                <p className="text-slate-600 mb-2">Đăng nhập để viết đánh giá</p>
                <Link
                    to={`/login?redirect=/products/${productId}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    // ✅ Nếu đã có review, ẩn form và hiển thị thông báo
    if (existingReview) {
        return (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">
                    Bạn đã đánh giá sản phẩm này
                </p>
            </div>
        );
    }

    const validate = () => {
        const newErrors = {};

        if (!rating || rating < 1 || rating > 5) {
            newErrors.rating = 'Vui lòng chọn số sao đánh giá (1-5)';
        }

        if (!comment || comment.trim().length < 3) {
            newErrors.comment = 'Vui lòng nhập nhận xét (tối thiểu 3 ký tự)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            await addReview(productId, {
                rating: Number(rating),
                comment: comment.trim()
            });
            setComment("");
            setRating(5);
            setErrors({});
            setIsSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Add review error:", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.[0] ||
                'Không thể gửi đánh giá. Vui lòng thử lại.';
            toast.error(errorMessage);
        }
    };

    // ✅ Nếu đã submit thành công
    if (isSubmitted) {
        return (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">
                    Gửi đánh giá thành công!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Viết đánh giá của bạn</h3>

            {/* Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Đánh giá của bạn <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                setRating(i + 1);
                                if (errors.rating) {
                                    setErrors(prev => ({ ...prev, rating: '' }));
                                }
                            }}
                            onMouseEnter={() => setHoveredRating(i + 1)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none"
                        >
                            <Star
                                size={28}
                                className={`transition ${(hoveredRating > 0 ? i < hoveredRating : i < rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
                )}
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nhận xét của bạn <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (errors.comment) {
                            setErrors(prev => ({ ...prev, comment: '' }));
                        }
                    }}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm (tối thiểu 3 ký tự)..."
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${errors.comment ? 'border-red-500' : 'border-slate-200'
                        }`}
                    required
                />
                {errors.comment && (
                    <p className="text-xs text-red-500 mt-1">{errors.comment}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                    {comment.length}/500 ký tự
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
        </form>
    );
}