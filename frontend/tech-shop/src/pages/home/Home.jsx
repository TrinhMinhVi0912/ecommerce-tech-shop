import React from 'react';
import HeroCarousel from '../../components/home/HeroCarousel';
import CategorySection from '@/components/home/CategorySection';
import BrandSection from '@/components/home/BrandSection';
import FeaturedProductSection from '@/components/home/FeaturedProductSection';
import ServiceSection from '@/components/home/ServiceSection';

const HomePage = () => {

  return (
    <div className="w-full">
      {/* 1. Banner Carousel */}
      <HeroCarousel />

      {/* 2. Danh mục sản phẩm */}
      <CategorySection />

      {/* 3. Sản phẩm nổi bật / mới nhất */}
      <FeaturedProductSection />

      {/* 4. Thương hiệu nổi bật */}
      <BrandSection />

      {/* 5. Dịch vụ / Cam kết */}
      <ServiceSection />
    </div>
  );
};

export default HomePage;