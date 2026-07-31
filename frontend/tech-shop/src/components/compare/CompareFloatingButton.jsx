// src/components/compare/CompareFloatingButton.jsx
import React, { useState, useEffect } from 'react';
import { GitCompare } from 'lucide-react';
import { useCompare } from '@/features/product/hooks/useCompare';

const CompareFloatingButton = () => {
    const { hasProducts, getProductCount, isOpen, openPanel } = useCompare();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Kiểm tra có sản phẩm không - với fallback an toàn
    const hasItems = hasProducts ? hasProducts() : false;
    const count = getProductCount ? getProductCount() : 0;

    // Auto hide khi không có sản phẩm
    useEffect(() => {
        if (!hasItems) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
        }
    }, [hasItems]);

    // Nếu panel đang mở, ẩn nút floating
    if (isOpen) return null;

    // Nếu không có sản phẩm và không visible, không hiển thị
    if (!hasItems && !isVisible) return null;

    // Nếu không có hàm hasProducts hoặc getProductCount, không hiển thị
    if (!hasProducts || !getProductCount) return null;

    const handleClick = () => {
        if (hasItems && openPanel) {
            openPanel();
        }
    };

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    flex items-center gap-2 px-3 py-3 
                    bg-blue-600 text-white 
                    rounded-l-xl shadow-lg 
                    transition-all duration-300 ease-in-out
                    hover:bg-blue-700 hover:shadow-xl
                    ${isHovered ? 'pr-4' : 'pr-3'}
                    ${!hasItems ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
                style={{
                    transform: `translateX(${isHovered ? '0' : '8px'})`,
                }}
                title="Mở so sánh"
            >
                <div className="relative">
                    <GitCompare size={20} />
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {count}
                        </span>
                    )}
                </div>

                {/* Text hiển thị khi hover */}
                <span
                    className={`
                        text-sm font-medium whitespace-nowrap
                        transition-all duration-300
                        ${isHovered ? 'max-w-[100px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}
                        overflow-hidden
                    `}
                >
                    {count === 1 ? '1 sản phẩm' : `${count} sản phẩm`}
                </span>
            </button>
        </div>
    );
};

export default CompareFloatingButton;