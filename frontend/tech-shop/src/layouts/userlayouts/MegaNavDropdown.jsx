import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const MegaNavDropdown = ({ 
  label, 
  items = [], 
  linkPrefix = '/products',
  queryParam = 'category'
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="static py-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger Button */}
      <button className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1 font-medium focus:outline-none">
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {/* Mega Dropdown Panel Tràn Màn Hình */}
      {open && items?.length > 0 && (
        <div className="absolute left-0 right-0 top-full w-full bg-white border-b border-gray-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-w-6xl mx-auto px-6 py-5">
            
            {/* Lưới hiển thị danh mục */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-4 gap-y-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`${linkPrefix}?${queryParam}=${item.id}`}
                  /* 
                    Cấu hình font chữ:
                    - text-xs: Cỡ chữ nhỏ vừa vặn
                    - font-normal: Chữ thường (không đậm)
                    - Bỏ 'uppercase' để chữ không bị viết hoa toàn bộ
                  */
                  className="text-xs font-normal text-gray-700 hover:text-blue-600 truncate transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MegaNavDropdown;