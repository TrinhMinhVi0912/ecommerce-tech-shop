import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useBanners from '@/features/banner/hooks/useBanners';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080/api';

const HeroCarousel = () => {
  const { data, loading, error } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(data);

  // Lọc lấy danh sách banner đang active từ data.data.items
  const banners = data?.data?.filter(
    banner => banner.isActive
  ) ?? [];

  // Tự động chuyển slide sau mỗi 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-slate-200 animate-pulse rounded-2xl mb-8" />
    );
  }

  // Error hoặc Empty State
  if (error || banners.length === 0) {
    return null; // Không hiển thị nếu không có banner
  }

  return (
    <section className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm group mb-8 bg-slate-900">
      {/* Banner Image */}
      <img
        src={`${IMAGE_BASE_URL}${banners[currentIndex]?.imageUrl}`}
        alt={banners[currentIndex]?.title || 'Banner'}
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
      />

      {/* Overlay Title
      {banners[currentIndex]?.title && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 sm:p-6 md:p-8">
          <h2 className="text-white text-base sm:text-xl md:text-2xl font-bold line-clamp-2">
            {banners[currentIndex].title}
          </h2>
        </div>
      )} */}

      {/* Controls (Next/Prev) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-all shadow"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-all shadow"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-white/60'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;