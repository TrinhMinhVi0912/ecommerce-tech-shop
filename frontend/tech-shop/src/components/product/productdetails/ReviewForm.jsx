import { useState } from "react";
import { Star } from "lucide-react";
import useAddReview from "@/features/review/hooks/useAddReview";

export default function ReviewForm({ productId, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const { addReview, loading } = useAddReview();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addReview(productId, { rating, comment });
            setComment("");
            setRating(5);
            onSuccess();
        } catch (error) {
            console.error("Add review error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Viết đánh giá của bạn</h3>

            {/* Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Đánh giá của bạn
                </label>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
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
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nhận xét của bạn
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    required
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
        </form>
    );
}