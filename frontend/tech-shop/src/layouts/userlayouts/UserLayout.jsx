// src/layouts/userlayouts/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ComparePanel from '@/components/compare/ComparePanel';
import CompareFloatingButton from '@/components/compare/CompareFloatingButton'; // ✅ Thêm import

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-8 md:pb-16">
        <Outlet />
      </main>

      <footer className="w-full mt-auto bg-slate-900 text-slate-100">
        <Footer />
      </footer>

      {/* ✅ Floating Button - hiển thị khi có sản phẩm trong so sánh */}
      <CompareFloatingButton />

      {/* Compare Panel */}
      <ComparePanel />
    </div>
  );
};

export default UserLayout;