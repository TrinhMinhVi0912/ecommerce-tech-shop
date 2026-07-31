import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import RatingSummary from "./RatingSummary";

export default function ProductReviews({
    productId,
    reviews = [],
    summary = {},
    loading = false,
    onReviewAdded,
    onReviewDeleted,
    onReviewUpdated
}) {
    const [showForm, setShowForm] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    const { averageRating = 0, totalReviews = 0, ratingBreakdown = {} } = summary;

    if (loading) {
        return (
            <div className="mt-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-slate-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Đánh giá sản phẩm</h2>

            {/* Rating Summary */}
            <RatingSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingBreakdown={ratingBreakdown}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between my-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Đóng' : 'Viết đánh giá'}
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy("newest")}
                        className={`px-3 py-1 text-sm rounded-lg transition ${sortBy === "newest"
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                    >
                        Mới nhất
                    </button>
                    <button
                        onClick={() => setSortBy("highest")}
                        className={`px-3 py-1 text-sm rounded-lg transition ${sortBy === "highest"
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                    >
                        Đánh giá cao
                    </button>
                    <button
                        onClick={() => setSortBy("lowest")}
                        className={`px-3 py-1 text-sm rounded-lg transition ${sortBy === "lowest"
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                    >
                        Đánh giá thấp
                    </button>
                </div>
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="mb-6">
                    <ReviewForm
                        productId={productId}
                        onSuccess={() => {
                            setShowForm(false);
                            onReviewAdded();
                        }}
                    />
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-500">Chưa có đánh giá nào cho sản phẩm này</p>
                    <p className="text-sm text-slate-400 mt-1">Hãy là người đầu tiên đánh giá!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewItem
                            key={review.reviewId}
                            review={review}
                            onDelete={onReviewDeleted}
                            onUpdate={onReviewUpdated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}