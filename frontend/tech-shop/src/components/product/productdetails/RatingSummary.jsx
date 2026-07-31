import { Star, StarHalf } from "lucide-react";

export default function RatingSummary({ averageRating = 0, totalReviews = 0, ratingBreakdown = {} }) {
    // Render stars
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <StarHalf key={i} size={20} className="fill-yellow-400 text-yellow-400" />;
                    } else {
                        return <Star key={i} size={20} className="text-slate-300" />;
                    }
                })}
                <span className="ml-2 font-medium">{rating.toFixed(1)}</span>
            </div>
        );
    };

    // Get max count for progress bar
    const maxCount = Math.max(...Object.values(ratingBreakdown), 0);

    return (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Average Rating */}
                <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-slate-900">
                        {averageRating.toFixed(1)}
                    </div>
                    {renderStars(averageRating)}
                    <div className="text-sm text-slate-500 mt-1">
                        {totalReviews} đánh giá
                    </div>
                </div>

                {/* Right: Rating Breakdown */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingBreakdown[rating] || 0;
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-12 text-right">
                                    {rating} sao
                                </span>
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-slate-500 w-12">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}