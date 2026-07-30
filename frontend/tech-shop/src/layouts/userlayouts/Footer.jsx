import React from 'react';
import { MapPin, Phone, Mail, Clock, Laptop } from 'lucide-react';
import { FaFacebookF, FaGithub, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-6 pb-4 text-[11px]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 pb-5 border-b border-gray-800">
          
          {/* Cột 1: Logo & Giới thiệu */}
          <div className="space-y-2">
            <div className="bg-white inline-flex px-2 py-1 rounded">
              <div className="flex items-center gap-1 text-blue-600 font-bold text-[11px]">
                <Laptop className="w-3.5 h-3.5" />
                <span>Tech Shop</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              TechShop là nền tảng e-commerce thiết bị công nghệ chính hãng với giá cả hợp lý và dịch vụ tận tâm.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-2 pt-0.5">
              <a href="#" className="p-1 rounded-full bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition">
                <FaFacebookF className="w-3 h-3" />
              </a>
              <a href="#" className="p-1 rounded-full bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition">
                <FaGithub className="w-3 h-3" />
              </a>
              <a href="#" className="p-1 rounded-full bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition">
                <FaYoutube className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-xs">Danh mục</h3>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Laptop</a></li>
              <li><a href="#" className="hover:text-white transition">PC</a></li>
              <li><a href="#" className="hover:text-white transition">Chuột</a></li>
              <li><a href="#" className="hover:text-white transition">Bàn phím</a></li>
              <li><a href="#" className="hover:text-white transition">Tai nghe</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-xs">Hỗ trợ</h3>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-xs">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Trường Đại học Cần Thơ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>0123456789</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>support@techshop.vn</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>08:00 - 21:00</span>
              </li>
            </ul>
          </div>

          {/* Cột 5: Nhận thông tin khuyến mãi */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-xs">
              Nhận thông tin khuyến mãi
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-1.5">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-2.5 py-1.5 text-[11px] bg-[#1e293b] text-white placeholder-gray-500 rounded border border-transparent focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="submit"
                className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] rounded-full transition"
              >
                Đăng ký
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <p>© 2026 TechShop. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">Điều khoản</a>
            <a href="#" className="hover:text-white transition">Chính sách</a>
            <a href="#" className="hover:text-white transition">Liên hệ</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;