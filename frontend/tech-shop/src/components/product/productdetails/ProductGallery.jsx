import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl, getProcessedImages } from "@/utils/imageUtils";

export default function ProductGallery({ images = [], productName = "" }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Xử lý images với URL đầy đủ
    const processedImages = getProcessedImages(images);

    if (!processedImages || processedImages.length === 0) {
        return (
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-slate-400">Không có ảnh</span>
            </div>
        );
    }

    const selectedImage = processedImages[selectedIndex];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden">
                <img
                    src={selectedImage.imageUrl}
                    alt={`${productName} - ${selectedIndex + 1}`}
                    className="w-full h-full object-contain"
                />

                {processedImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedIndex(prev => prev === 0 ? processedImages.length - 1 : prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white shadow-md transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setSelectedIndex(prev => prev === processedImages.length - 1 ? 0 : prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white shadow-md transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {processedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {processedImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${index === selectedIndex
                                    ? 'border-blue-500'
                                    : 'border-transparent hover:border-slate-300'
                                }`}
                        >
                            <img
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}