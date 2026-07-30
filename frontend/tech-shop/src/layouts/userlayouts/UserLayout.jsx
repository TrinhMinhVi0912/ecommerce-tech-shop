import React from 'react';
import { Outlet } from 'react-router-dom';
// Đảm bảo đường dẫn import phù hợp với cấu trúc thư mục dự án của bạn
import Navbar from './Navbar';
import Footer from './Footer';

const UserLayout = () => {
  return (
    /* 
      1. min-h-screen & flex flex-col: 
         Tạo layout dạng cột phủ kín màn hình (Sticky Footer pattern).
      2. bg-slate-50 text-slate-900: 
         Màu nền chuẩn cho website e-commerce giúp nổi bật thẻ sản phẩm.
    */
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 
        Header cố định / sticky ở đỉnh trang
        - z-50: Đảm bảo header và dropdown menu luôn đè lên nội dung bên dưới.
      */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <Navbar />
      </header>

      {/* 
        Phần nội dung chính (<Outlet />)
        - flex-1: Tự động giãn tối đa để đẩy Footer xuống đáy màn hình khi ít nội dung.
        - pt-6 md:pt-8: Thêm spacing phía trên để tránh va chạm sát mép Navbar sticky/fixed.
        - max-w-7xl mx-auto px-4...: Giới hạn chiều rộng nội dung chuẩn responsive cho Tech Shop.
      */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-8 md:pb-16">
        <Outlet />
      </main>

      {/* Footer ở cuối trang */}
      <footer className="w-full mt-auto bg-slate-900 text-slate-100">
        <Footer />
      </footer>
    </div>
  );
};

export default UserLayout;