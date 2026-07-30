import React from 'react';
import { Truck, ShieldCheck, CreditCard, Headset } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Áp dụng cho đơn hàng từ 500k',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán an toàn',
    description: 'Bảo mật thông tin 100%',
  },
  {
    icon: ShieldCheck,
    title: 'Bảo hành chính hãng',
    description: 'Cam kết chất lượng 100%',
  },
  {
    icon: Headset,
    title: 'Hỗ trợ 24/7',
    description: 'Giải đáp thắc mắc nhanh chóng',
  },
];

const ServiceSection = () => {
  return (
    <section className="mb-8 border-t border-slate-200/60 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceSection;