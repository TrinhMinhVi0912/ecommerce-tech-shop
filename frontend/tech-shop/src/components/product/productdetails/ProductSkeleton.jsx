export default function ProductSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Image skeleton */}
                    <div className="bg-gray-200 rounded-lg h-[400px] animate-pulse" />

                    {/* Info skeleton */}
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}